# UzOS website

The website of [UzOS](https://github.com/umidjon0339/UzOS): home page, downloads and documentation, in English, Uzbek and Russian.

Built with Next.js 16 (App Router), Tailwind CSS 4 and MDX. Every page is static.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where things are

```
app/[lang]/                 every page, once per language (/en, /uz, /ru)
  page.tsx                  home
  download/page.tsx         download page
  docs/layout.tsx           docs sidebar
  docs/[[...slug]]/page.tsx renders one MDX doc
  docs/managements/[id]/    one page per management (from lib/os-data.json)
components/                 Navbar, Footer, CodeBlock, Callout, ManagementDoc, ...
content/docs/<lang>/*.mdx   the documentation text
i18n/dictionaries/*.json    the UI text (en.json is the reference)
lib/docs.ts                 the docs tree: sidebar order, titles, URLs
lib/modules.ts              the 12 managements: icon, name, short text
lib/os-data.json            commands, syscalls, attacks... read from the UzOS source
scripts/extract-uzos.mjs    writes lib/os-data.json
lib/release.ts              current version, ISO link, size, SHA-256
proxy.ts                    sends "/" to /en, /uz or /ru
public/screenshots/         real UzOS screenshots (QEMU)
```

## Common tasks

**Publish a new UzOS version**: in the UzOS repo run `make iso` and `sha256sum UzOS.iso`, create a GitHub Release with tag `v<version>` and attach the ISO, then update `lib/release.ts`.

**UzOS code changed** (new command, syscall, attack...): run `npm run extract` (it reads `../New-UzOS`; pass another path with `node scripts/extract-uzos.mjs <path>`), then commit `lib/os-data.json`. The management pages are built from the header comments, so a good comment in the code is a good line in the docs.

**Add a doc page**: write `content/docs/en/<file>.mdx` (plus `uz/` and `ru/`; a missing translation falls back to English) and add an entry to `lib/docs.ts`. `<Callout type="note|tip|warning">` works in every MDX file.

**Change UI text**: edit the three files in `i18n/dictionaries/`. They must have the same keys.

## Deploy

Import this repository in [Vercel](https://vercel.com/new). There are no settings or environment variables to change.
