import { getLanguageDef } from "./languages";

interface HastElement {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children: HastNode[];
}

type HastNode = HastElement | { type: string; value: string };

interface MetaAttrs {
  title?: string;
  [key: string]: string | undefined;
}

function parseMeta(meta: string): MetaAttrs {
  const attrs: MetaAttrs = {};
  const regex = /(\w+)\s*=\s*"([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(meta)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function getLanguage(node: HastElement): string {
  const className = (node.properties?.className as string[]) ?? [];
  for (const cls of className) {
    if (cls.startsWith("language-")) {
      return cls.slice("language-".length);
    }
  }
  return "";
}

function getMeta(node: HastElement): string {
  const props = node.properties as Record<string, unknown>;
  return (
    (typeof props.dataMeta === "string" ? props.dataMeta : undefined) ??
    (typeof props["data-meta"] === "string" ? props["data-meta"] : undefined) ??
    ""
  );
}

function isElementNode(node: HastNode): node is HastElement {
  return node.type === "element" && "tagName" in node;
}

function walk(node: HastNode): void {
  if (!isElementNode(node)) return;

  if (node.tagName === "pre") {
    const code = node.children.find(
      (child): child is HastElement =>
        isElementNode(child) && child.tagName === "code",
    );
    if (code) {
      const lang = getLanguage(code);
      const langDef = lang ? getLanguageDef(lang) : undefined;
      const meta = parseMeta(getMeta(code));
      const title = meta.title ?? "";

      // Only inject data attributes — no wrapping
      node.properties = {
        ...node.properties,
        "data-code-language": lang,
        "data-code-icon": langDef?.icon ?? "",
        "data-code-label": langDef?.label ?? lang,
        "data-code-title": title,
      };
    }
    return;
  }

  for (const child of node.children) {
    walk(child);
  }
}

export function rehypeCodeWrapper() {
  return (tree: HastNode) => {
    walk(tree);
  };
}
