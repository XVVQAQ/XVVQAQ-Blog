export interface LanguageDef {
  label: string;
  icon: string;
}

export const languages: Record<string, LanguageDef> = {
  ts: {
    label: "TypeScript",
    icon: "vscode-icons:file-type-typescript-official",
  },
  tsx: {
    label: "TypeScript React",
    icon: "vscode-icons:file-type-typescript-official",
  },
  js: {
    label: "JavaScript",
    icon: "vscode-icons:file-type-js-official",
  },
  jsx: {
    label: "JavaScript React",
    icon: "vscode-icons:file-type-js-official",
  },
  rs: {
    label: "Rust",
    icon: "vscode-icons:file-type-rust",
  },
  py: {
    label: "Python",
    icon: "vscode-icons:file-type-python",
  },
  html: {
    label: "HTML",
    icon: "vscode-icons:file-type-html",
  },
  css: {
    label: "CSS",
    icon: "vscode-icons:file-type-css",
  },
  scss: {
    label: "SCSS",
    icon: "vscode-icons:file-type-scss2",
  },
  json: {
    label: "JSON",
    icon: "vscode-icons:file-type-json",
  },
  md: {
    label: "Markdown",
    icon: "vscode-icons:file-type-markdown",
  },
  bash: {
    label: "Bash",
    icon: "vscode-icons:file-type-shell",
  },
  sh: {
    label: "Shell",
    icon: "vscode-icons:file-type-shell",
  },
  yaml: {
    label: "YAML",
    icon: "vscode-icons:file-type-yaml",
  },
  toml: {
    label: "TOML",
    icon: "vscode-icons:file-type-toml",
  },
  svelte: {
    label: "Svelte",
    icon: "vscode-icons:file-type-svelte",
  },
  astro: {
    label: "Astro",
    icon: "vscode-icons:file-type-astro",
  },
  vue: {
    label: "Vue",
    icon: "vscode-icons:file-type-vue",
  },
  dockerfile: {
    label: "Dockerfile",
    icon: "vscode-icons:file-type-docker",
  },
  sql: {
    label: "SQL",
    icon: "vscode-icons:file-type-sql",
  },
  go: {
    label: "Go",
    icon: "vscode-icons:file-type-go",
  },
  rust: {
    label: "Rust",
    icon: "vscode-icons:file-type-rust",
  },
  cpp: {
    label: "C++",
    icon: "vscode-icons:file-type-cpp3",
  },
  c: {
    label: "C",
    icon: "vscode-icons:file-type-c",
  },
};

export function getLanguageDef(lang: string): LanguageDef | undefined {
  return languages[lang];
}
