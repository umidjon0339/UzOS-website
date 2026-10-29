// The current UzOS release. To publish a new version:
//   1. in the UzOS repo: make iso && sha256sum UzOS.iso
//   2. create a GitHub Release with tag `v<version>` and attach UzOS.iso
//   3. update the fields below
export const GITHUB_URL = "https://github.com/umidjon0339/UzOS";

export const release = {
  version: "1.0",
  date: "2026-10-29",
  fileName: "UzOS.iso",
  sizeBytes: 32_700_416,
  sha256: "3351f18a6d23ad20065c5797d462c96172602b5c304899fd3edbe0a57b104f2d",
  arch: "x86 (32-bit, i386)",
};

export const downloadUrl = `${GITHUB_URL}/releases/download/v${release.version}/${release.fileName}`;
export const releasesUrl = `${GITHUB_URL}/releases`;
export const sizeMB = (release.sizeBytes / 1024 / 1024).toFixed(1);
