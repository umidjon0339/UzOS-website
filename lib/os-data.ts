import data from "./os-data.json";

// What scripts/extract-uzos.mjs reads from the UzOS source. Every text
// here is a header comment or README line from the code itself.

export type CorePart = { name: string; summary: string; path: string };

export type Command = {
  name: string;
  usage: string;
  summary: string;
  details: string;
  uses: string;
  path: string;
};

export type Syscall = {
  name: string;
  number: number | null;
  stub: boolean;
  summary: string;
  details: string;
  uses: string;
  path: string;
};

export type Defence = {
  id: string;
  fix: string;
  called: string;
  rules: string;
  why: string;
  story: string;
  path: string;
};

export type AttackPair = {
  id: string;
  what: string;
  kind: "live" | "illustration" | "concept";
  breaks: string;
  severity: string;
  story: string;
  modes: { mode: string; text: string }[];
  tryIt: string;
  path: string;
  defence: Defence;
};

export type ModuleData = {
  folder: string;
  core: CorePart[];
  commands: Command[];
  syscalls: Syscall[];
  security: AttackPair[];
};

const modules = (data as unknown as { modules: Record<string, ModuleData> }).modules;

// Data for one management folder; empty for the ones not written yet.
export function moduleData(folder: string): ModuleData {
  return modules[folder] ?? { folder, core: [], commands: [], syscalls: [], security: [] };
}
