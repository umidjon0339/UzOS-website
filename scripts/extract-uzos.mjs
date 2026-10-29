// Reads the UzOS source and writes lib/os-data.json: every command,
// system call, core part and attack/defence pair of each management,
// taken from the header comments the code already has.
//
//   node scripts/extract-uzos.mjs ../New-UzOS      (or: npm run extract)
//
// Run it again whenever UzOS changes; commit the JSON it writes.

import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(process.argv[2] ?? "../New-UzOS");
const out = path.resolve(import.meta.dirname, "../lib/os-data.json");

// The ten managements that exist in the code today.
const MODULES = [
  "process_management",
  "memory_management",
  "cpu_management",
  "device_management",
  "io_management",
  "filesystem_management",
  "user_management",
  "security_management",
  "shell",
  "ui",
];

// --- small file helpers ------------------------------------------------------

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const subdirs = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
    : [];
const rel = (file) => path.relative(repo, file).split(path.sep).join("/");

function walk(dir, test, found = []) {
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, test, found);
    else if (test(entry.name)) found.push(full);
  }
  return found.sort();
}

// The main file of a folder: <prefix><folder>.c, else the first match.
function mainFile(dir, prefix, ext = ".c") {
  const want = path.join(dir, `${prefix}${path.basename(dir)}${ext}`);
  if (fs.existsSync(want)) return want;
  const any = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith(ext)).sort() : [];
  return any.length ? path.join(dir, any[0]) : null;
}

// --- the header comment ------------------------------------------------------
//
//   /*
//    * cmd_top.c - `top`: a live view of the CPU.     <- title
//    *
//    * More lines that explain it.                    <- details
//    *
//    * Uses: ui_printf (ui module), ...               <- uses
//    */

function headerComment(source) {
  // Headers may start with their include guard: #ifndef X / #define X.
  const m = source.match(/^(?:\s*#.*\n)*\s*\/\*([\s\S]*?)\*\//);
  if (!m) return null;
  const lines = m[1].split("\n").map((l) => l.replace(/^\s?\*\s?/, "").replace(/\s+$/, ""));
  while (lines.length && !lines[0].trim()) lines.shift();
  const title = (lines.shift() ?? "").trim();
  const rest = title.includes(" - ") ? title.slice(title.indexOf(" - ") + 3).trim() : title;

  // Split off "Uses:" (and its indented continuation lines).
  const details = [];
  const uses = [];
  let inUses = false;
  for (const line of lines) {
    if (/^Uses:/.test(line)) {
      inUses = true;
      uses.push(line.replace(/^Uses:\s*/, ""));
    } else if (inUses && /^\s+\S/.test(line)) {
      uses.push(line.trim());
    } else {
      inUses = false;
      details.push(line);
    }
  }
  return { rest, details: tidy(details.join("\n")), uses: uses.join(" ").replace(/\s+/g, " ").trim() };
}

// Removes blank lines at both ends and the common indentation.
function tidy(text) {
  const lines = text.split("\n");
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length), 99);
  return lines.map((l) => l.slice(indent === 99 ? 0 : indent)).join("\n");
}

// "Called: process_create() ..." style sections in a defence header.
function sections(details) {
  const found = {};
  let key = null;
  for (const line of details.split("\n")) {
    const m = line.match(/^([A-Z][a-z]+):\s*(.*)$/);
    if (m) {
      key = m[1].toLowerCase();
      found[key] = m[2];
    } else if (key && /^\s+\S/.test(line)) {
      found[key] += "\n" + line.trim();
    } else {
      key = null;
    }
  }
  return found;
}

// --- C struct initialisers ---------------------------------------------------

// Splits "a, \"b, c\", d" at the commas that are not inside quotes.
function splitFields(body) {
  const fields = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '"' && body[i - 1] !== "\\") quoted = !quoted;
    if (c === "," && !quoted) {
      fields.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  if (cur.trim()) fields.push(cur.trim());
  return fields;
}

// "abc" "def" -> abc def (C joins neighbouring strings).
const cString = (field) => [...(field ?? "").matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).join("");

function struct(source, type, name) {
  const m = source.match(new RegExp(`static const ${type} ${name}\\s*=\\s*\\{([\\s\\S]*?)\\};`));
  if (!m) return null;
  const body = m[1].replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  return splitFields(body);
}

// --- README of an attack -----------------------------------------------------

function readmeSections(text) {
  const found = {};
  let key = null;
  for (const line of text.split("\n")) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) key = h[1].trim().toLowerCase();
    else if (key) found[key] = (found[key] ?? "") + line + "\n";
  }
  for (const k of Object.keys(found)) found[k] = found[k].trim();
  return found;
}

// The first paragraph as one line ("...is enough:" before a code block ends in ".").
const paragraph = (text) => (text ?? "").split(/\n\s*\n/)[0].replace(/\s*\n\s*/g, " ").trim().replace(/:$/, ".");

// "| `live` | as uid 1, ... |" rows -> [{ mode, text }]
function tableRows(text) {
  return (text ?? "")
    .split("\n")
    .filter((l) => /^\|/.test(l) && !/^\|\s*-/.test(l))
    .map((l) => l.split("|").slice(1, -1).map((c) => c.trim().replace(/`/g, "")))
    .filter((cells) => cells.length >= 2 && cells[0].toLowerCase() !== "mode")
    .map(([mode, text]) => ({ mode, text }));
}

const codeBlock = (text) => (text ?? "").match(/```[a-z]*\n([\s\S]*?)```/)?.[1].trim() ?? "";

// The other README style: "**Attack (concept).** text" paragraphs.
function boldParagraph(text, label) {
  const p = text.split(/\n\s*\n/).find((x) => x.trim().startsWith(`**${label}`));
  return p ? p.replace(/^\s*\*\*[^*]+\*\*\s*/, "").replace(/\s*\n\s*/g, " ").trim() : "";
}

// "# spectre -> user_kernel_isolation  (illustration)" -> "illustration"
const readmeKind = (text) => text.split("\n")[0].match(/\((concept|illustration)\)/)?.[1] ?? "live";

// --- one management ----------------------------------------------------------

function extractModule(name) {
  const dir = path.join(repo, "modules", name);

  // The parts the kernel calls: core/<part>/, or (device_management)
  // one folder per driver next to commands/ and security/.
  // A folder with no code of its own (gui/) is listed by its subfolders.
  const hasCode = (d) => fs.readdirSync(d).some((f) => /\.(c|h|s)$/.test(f));
  const coreDirs = [
    ...subdirs(path.join(dir, "core")).map((p) => path.join(dir, "core", p)),
    ...subdirs(dir).filter((p) => !["core", "commands", "syscalls", "security"].includes(p)).map((p) => path.join(dir, p)),
  ].flatMap((d) => (hasCode(d) ? [d] : subdirs(d).map((s) => path.join(d, s))));
  const core = coreDirs.map((d) => {
    const parent = path.basename(path.dirname(d));
    const part = ["core", name].includes(parent) ? path.basename(d) : `${parent}/${path.basename(d)}`;
    // The folder's own .c/.s/.h, else any source file, else its README.
    const any = fs.readdirSync(d).filter((f) => /\.(c|h|s)$/.test(f)).sort();
    const file = mainFile(d, "", ".c") ?? mainFile(d, "", ".s") ?? mainFile(d, "", ".h") ?? (any[0] && path.join(d, any[0]));
    const h = file ? headerComment(read(file)) : null;
    const readme = read(path.join(d, "README.md")).split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith("#"));
    return { name: part, summary: h?.rest || paragraph(readme), path: rel(d) };
  });

  const commands = subdirs(path.join(dir, "commands")).flatMap((folder) => {
    const file = mainFile(path.join(dir, "commands", folder), "cmd_");
    const h = file && headerComment(read(file));
    if (!h) return [];
    // "`getconf NAME` / `getconf -a`: the system's sizes" -> usage + summary
    const m = h.rest.match(/^((?:`[^`]+`\s*(?:\/\s*)?)+):\s*(.*)$/);
    const usage = m ? [...m[1].matchAll(/`([^`]+)`/g)].map((u) => u[1]).join("  |  ") : folder;
    return [{ name: folder.replace(/_/g, " "), usage, summary: m ? m[2] : h.rest, details: h.details, uses: h.uses, path: rel(path.dirname(file)) }];
  });

  const syscalls = subdirs(path.join(dir, "syscalls"))
    .filter((f) => f !== "handler")
    .flatMap((folder) => {
      const d = path.join(dir, "syscalls", folder);
      const file = mainFile(d, "sys_");
      const h = file && headerComment(read(file));
      if (!h) return [];
      // "getpid(): return the PID" or "fork() STUB: needs ..."
      const m = h.rest.match(/^([a-z0-9_]+)\(\)\s*([A-Z]+)?\s*:\s*(.*)$/);
      const header = read(mainFile(d, "sys_", ".h") ?? "");
      const nr = header.match(/#define\s+SYS_[A-Z0-9_]+?(?<!_H)\s+(\d+)/)?.[1];
      return [{
        name: m ? m[1] : folder,
        number: nr ? Number(nr) : null,
        stub: m?.[2] === "STUB",
        summary: m ? m[3] : h.rest,
        details: h.details,
        uses: h.uses,
        path: rel(d),
      }];
    })
    .sort((a, b) => (a.number ?? 999) - (b.number ?? 999) || a.name.localeCompare(b.name));

  // Defences first, so each attack can find its own by id.
  const defences = {};
  for (const file of walk(path.join(dir, "security"), (f) => /^def_.*\.c$/.test(f))) {
    const src = read(file);
    const f = struct(src, "defence_t", "defence");
    if (!f) continue;
    const s = sections(headerComment(src)?.details ?? "");
    defences[cString(f[0])] = {
      id: cString(f[0]),
      fix: cString(f[1]),
      called: (s.called ?? "").replace(/\s*\n\s*/g, " "),
      rules: s.rules ?? "",
      why: (s.why ?? "").replace(/\s*\n\s*/g, " "),
      path: rel(path.dirname(file)),
    };
  }

  const security = walk(path.join(dir, "security"), (f) => /^atk_.*\.c$/.test(f)).flatMap((file) => {
    const f = struct(read(file), "attack_t", "attack");
    if (!f) return [];
    const text = read(path.join(path.dirname(file), "README.md"));
    const readme = readmeSections(text);
    const defenceId = cString(f[7]);
    const defence = defences[defenceId] ?? { id: defenceId, fix: "", called: "", rules: "", why: "", path: "" };
    return [{
      id: cString(f[0]),
      what: cString(f[1]),
      kind: readmeKind(text), // live, illustration or concept
      breaks: (f[2] ?? "").replace(/^INV_/, "").toLowerCase(),
      severity: (f[3] ?? "").replace(/^SEV_/, "").toLowerCase(),
      story: paragraph(readme["what it does"]) || boldParagraph(text, "Attack"),
      modes: tableRows(readme["in uzos"]),
      tryIt: codeBlock(readme["try it"]),
      path: rel(path.dirname(file)),
      defence: { ...defence, story: boldParagraph(text, "Defence") },
    }];
  });

  return { folder: name, core, commands, syscalls, security };
}

// --- write it all ------------------------------------------------------------

const modules = Object.fromEntries(MODULES.map((m) => [m, extractModule(m)]));
fs.writeFileSync(out, JSON.stringify({ modules }, null, 1) + "\n");

for (const [name, m] of Object.entries(modules)) {
  console.log(
    `${name.padEnd(22)} core ${String(m.core.length).padStart(2)}  commands ${String(m.commands.length).padStart(2)}  ` +
      `syscalls ${String(m.syscalls.length).padStart(2)}  attacks ${String(m.security.length).padStart(2)}`,
  );
}
console.log(`wrote ${path.relative(process.cwd(), out)}`);
