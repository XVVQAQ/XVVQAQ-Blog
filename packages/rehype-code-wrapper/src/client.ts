/**
 * Maps Expressive Code's data-language values to icon + label.
 */
const langMap: Record<string, { label: string; icon: string }> = {
  typescript: {
    label: "TypeScript",
    icon: "vscode-icons:file-type-typescript-official",
  },
  ts: {
    label: "TypeScript",
    icon: "vscode-icons:file-type-typescript-official",
  },
  tsx: {
    label: "TypeScript React",
    icon: "vscode-icons:file-type-typescript-official",
  },
  javascript: {
    label: "JavaScript",
    icon: "vscode-icons:file-type-js-official",
  },
  js: { label: "JavaScript", icon: "vscode-icons:file-type-js-official" },
  jsx: {
    label: "JavaScript React",
    icon: "vscode-icons:file-type-js-official",
  },
  rust: { label: "Rust", icon: "vscode-icons:file-type-rust" },
  rs: { label: "Rust", icon: "vscode-icons:file-type-rust" },
  python: { label: "Python", icon: "vscode-icons:file-type-python" },
  py: { label: "Python", icon: "vscode-icons:file-type-python" },
  html: { label: "HTML", icon: "vscode-icons:file-type-html" },
  css: { label: "CSS", icon: "vscode-icons:file-type-css" },
  scss: { label: "SCSS", icon: "vscode-icons:file-type-scss2" },
  json: { label: "JSON", icon: "vscode-icons:file-type-json" },
  markdown: { label: "Markdown", icon: "vscode-icons:file-type-markdown" },
  md: { label: "Markdown", icon: "vscode-icons:file-type-markdown" },
  bash: { label: "Bash", icon: "vscode-icons:file-type-shell" },
  sh: { label: "Shell", icon: "vscode-icons:file-type-shell" },
  shell: { label: "Shell", icon: "vscode-icons:file-type-shell" },
  yaml: { label: "YAML", icon: "vscode-icons:file-type-yaml" },
  toml: { label: "TOML", icon: "vscode-icons:file-type-toml" },
  svelte: { label: "Svelte", icon: "vscode-icons:file-type-svelte" },
  astro: { label: "Astro", icon: "vscode-icons:file-type-astro" },
  vue: { label: "Vue", icon: "vscode-icons:file-type-vue" },
  dockerfile: { label: "Dockerfile", icon: "vscode-icons:file-type-docker" },
  sql: { label: "SQL", icon: "vscode-icons:file-type-sql" },
  go: { label: "Go", icon: "vscode-icons:file-type-go" },
  cpp: { label: "C++", icon: "vscode-icons:file-type-cpp3" },
  c: { label: "C", icon: "vscode-icons:file-type-c" },
};

/**
 * Crop the SVG viewBox to tightly fit its visual content,
 * removing internal padding (e.g. vscode-icons has 2px padding in 32x32 viewBox).
 */
function tightenViewBox(svg: string): string {
  // Find a background rect that indicates padding
  const rectTag = svg.match(/<rect[^>]*>/);
  if (!rectTag) return svg;

  const getAttr = (name: string): number | null => {
    const m = rectTag[0].match(new RegExp(`${name}="([\\d.]+)"`));
    return m ? parseFloat(m[1]) : null;
  };

  const rx = getAttr("x") ?? 0;
  const ry = getAttr("y") ?? 0;
  const rw = getAttr("width");
  const rh = getAttr("height");

  // Only adjust if there's actual padding and we have valid dimensions
  if ((rx > 0 || ry > 0) && rw !== null && rh !== null) {
    // Only remove width/height from the <svg> tag, not from child elements
    const cleaned = svg.replace(
      /<svg([^>]*)>/,
      (match, attrs) =>
        `<svg ${attrs.replace(/\s+(width|height)="[^"]*"/g, "").trim()}>`,
    );
    return cleaned.replace(
      /viewBox="[^"]+"/,
      `viewBox="${rx} ${ry} ${rw} ${rh}"`,
    );
  }

  return svg;
}

/** Cache for loaded SVG strings */
const svgCache = new Map<string, string>();

/** Fetch an SVG from Iconify API and cache it */
async function loadSvg(iconName: string): Promise<string> {
  if (svgCache.has(iconName)) return svgCache.get(iconName)!;
  try {
    const res = await fetch(`https://api.iconify.design/${iconName}.svg`);
    const svg = await res.text();
    svgCache.set(iconName, svg);
    return svg;
  } catch {
    return "";
  }
}

function init() {
  const pres = document.querySelectorAll<HTMLElement>("pre[data-language]");
  if (!pres.length) return;

  pres.forEach((pre) => {
    const fig = pre.closest<HTMLElement>("figure.frame");
    if (!fig) return;
    if (fig.closest(".code-frame")) return;

    const rawLang = pre.dataset.language || "";
    if (!rawLang) return;

    const lang = rawLang.toLowerCase();
    const def = langMap[lang] || { label: lang, icon: "" };

    // --- Wrap figure in .code-frame ---
    const frame = document.createElement("div");
    frame.className = "code-frame";

    // --- Header ---
    const header = document.createElement("div");
    header.className = "code-header";

    // Icon — injected as inline SVG
    const iconSpan = document.createElement("span");
    iconSpan.className = "code-icon";
    if (def.icon) {
      loadSvg(def.icon).then((svg) => {
        if (svg) iconSpan.innerHTML = tightenViewBox(svg);
      });
    }
    header.appendChild(iconSpan);

    // Language label
    const langLabel = document.createElement("span");
    langLabel.className = "code-lang-label";
    langLabel.textContent = def.label;
    header.appendChild(langLabel);

    // --- Assemble ---
    fig.parentNode?.insertBefore(frame, fig);
    frame.appendChild(header);
    frame.appendChild(fig);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
document.addEventListener("astro:after-swap", init);
