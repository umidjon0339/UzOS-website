import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";

// How Markdown elements in content/docs are drawn. Most styling comes
// from the .docs-prose class; only a few elements need a component.
const components: MDXComponents = {
  pre: CodeBlock,
  // Links inside the site use next/link (no full page reload).
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} target="_blank" rel="noreferrer" {...props} />,
  // Wide tables scroll sideways on phones instead of breaking the page.
  table: (props) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  // Available in every .mdx file without an import: <Callout type="warning">…</Callout>
  Callout,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
