// @ts-check
import { defineConfig } from "astro/config";
import Icons from "unplugin-icons/vite";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";

import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.xvvqaq.top",

  vite: {
    plugins: [
      Icons({
        compiler: "astro",
      }),
    ],
  },

  markdown: {
    syntaxHighlight: { type: "shiki", excludeLangs: ["math"] },
    shikiConfig: { theme: "github-dark", wrap: true },
    remarkPlugins: /** @type {import("astro").RemarkPlugins} */ ([
      remarkMath,
      remarkGfm,
    ]),
    rehypePlugins: /** @type {import("astro").RehypePlugins} */ ([
      rehypeKatex,
      /** @type {any} */ (rehypeAccessibleEmojis),
      [
        /** @type {any} */ (rehypeAutolinkHeadings),
        { behavior: "wrap", properties: { className: ["heading-anchor"] } },
      ],
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ]),
  },

  integrations: [svelte(), sitemap(), mdx()],
});
