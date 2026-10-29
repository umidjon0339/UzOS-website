// Fills "{name}" placeholders: fill("Download {file}", { file: "UzOS.iso" }).
export function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
}
