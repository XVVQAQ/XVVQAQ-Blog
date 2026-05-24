<script lang="ts">
  import { onMount } from "svelte";

  export let headings: { depth: number; slug: string; text: string }[] = [];
  export let title = "On this page";

  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 4);

  interface TocItem {
    slug: string;
    text: string;
    depth: number;
    children: TocItem[];
  }

  function buildTree(items: { depth: number; slug: string; text: string }[]): TocItem[] {
    const root: TocItem[] = [];
    const stack: TocItem[] = [];
    for (const h of items) {
      const node: TocItem = {
        slug: h.slug,
        text: h.text,
        depth: h.depth,
        children: [],
      };
      while (stack.length > 0 && stack[stack.length - 1].depth >= h.depth) {
        stack.pop();
      }
      if (stack.length === 0) {
        root.push(node);
      } else {
        stack[stack.length - 1].children.push(node);
      }
      stack.push(node);
    }
    return root;
  }

  const tree = buildTree(filtered);

  let indicator: HTMLDivElement;
  let listEl: HTMLUListElement;

  let hasContent = tree.length > 0;

  onMount(() => {
    if (!hasContent || !indicator || !listEl) return;

    const headingEls = document.querySelectorAll(
      ".post-content h2, .post-content h3, .post-content h4"
    );
    if (headingEls.length === 0) return;

    const links = Array.from(listEl.querySelectorAll<HTMLAnchorElement>("a"));
    const slugMap: Record<string, HTMLAnchorElement> = {};
    const allSlugs: string[] = [];

    links.forEach((a) => {
      const slug = a.getAttribute("href")?.replace("#", "");
      if (slug) {
        slugMap[slug] = a;
        allSlugs.push(slug);
      }
    });

    // Track visible headings persistently
    const visible = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, true);
          } else {
            visible.delete(entry.target.id);
          }
        });
        updateIndicator();
      },
      { rootMargin: "-64px 0px -64px 0px" }
    );

    headingEls.forEach((h) => observer.observe(h));

    function updateIndicator() {
      if (!indicator || !listEl) return;

      const visibleSlugs = allSlugs.filter((s) => visible.has(s));

      // Update active link (topmost visible)
      links.forEach((a) => a.classList.remove("active"));
      let hasActive = false;
      for (let i = 0; i < allSlugs.length; i++) {
        if (visible.has(allSlugs[i])) {
          const link = slugMap[allSlugs[i]];
          if (link) {
            link.classList.add("active");
            hasActive = true;
          }
          break;
        }
      }

      // Range indicator
      if (!hasActive || visibleSlugs.length === 0) {
        indicator.style.display = "none";
        return;
      }
      indicator.style.display = "block";

      const firstIdx = allSlugs.indexOf(visibleSlugs[0]);
      const lastIdx = allSlugs.indexOf(visibleSlugs[visibleSlugs.length - 1]);
      if (firstIdx === -1 || lastIdx === -1) return;

      const firstLink = slugMap[allSlugs[firstIdx]];
      const lastLink = slugMap[allSlugs[lastIdx]];
      if (!firstLink || !lastLink) return;

      const firstLi = firstLink.closest("li");
      const lastLi = lastLink.closest("li");
      if (!firstLi || !lastLi) return;

      const listRect = listEl.getBoundingClientRect();
      const firstRect = firstLi.getBoundingClientRect();
      const lastRect = lastLi.getBoundingClientRect();

      indicator.style.top = `${firstRect.top - listRect.top}px`;
      indicator.style.height = `${lastRect.bottom - firstRect.top}px`;
      indicator.style.display = "block";
    }

    // Scroll listener for smooth updates
    window.addEventListener("scroll", updateIndicator, { passive: true });

    // Click handler: smooth scroll
    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        if (!href) return;
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  });
</script>

{#if hasContent}
  <div class="toc-wrapper" data-pagefind-ignore>
    <div class="toc-sticky">
      <div class="toc-title">{title}</div>
      <nav class="toc-nav">
        <div class="toc-indicator" bind:this={indicator}></div>
        <ul class="toc-list" bind:this={listEl}>
          {#each tree as item}
            <li class="depth-{item.depth}">
              <a href="#{item.slug}">{item.text}</a>
              {#if item.children.length > 0}
                <ul>
                  {#each item.children as child}
                    <li class="depth-{child.depth}">
                      <a href="#{child.slug}">{child.text}</a>
                      {#if child.children.length > 0}
                        <ul>
                          {#each child.children as c}
                            <li class="depth-{c.depth}">
                              <a href="#{c.slug}">{c.text}</a>
                            </li>
                          {/each}
                        </ul>
                      {/if}
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      </nav>
    </div>
  </div>
{/if}

<style>
  .toc-wrapper { font-size: 0.8125rem; line-height: 1.6; }
  .toc-sticky { position: sticky; top: 1.5rem; }
  .toc-title {
    font-weight: 600; margin-bottom: 0.5rem; font-size: 0.75rem;
    text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6;
  }
  .toc-nav { position: relative; }
  .toc-indicator {
    display: none;
    position: absolute; left: 0; width: 2px;
    background: var(--link-color); border-radius: 2px;
    transition: top 0.15s ease, height 0.15s ease;
    pointer-events: none; z-index: 1;
  }
  .toc-list, .toc-list ul {
    list-style: none; margin: 0; padding: 0; position: relative;
  }
  .toc-list li { margin: 0; padding: 0; }
  .toc-list a {
    display: block; padding: 0.2rem 0; padding-left: 0.75rem;
    border-left: 2px solid transparent; color: var(--text-color);
    text-decoration: none; opacity: 0.5;
    transition: opacity 0.2s, border-color 0.2s;
    position: relative; z-index: 2;
  }
  .toc-list a:hover { opacity: 0.8; }
  .toc-list a.active { opacity: 1; color: var(--link-color); border-left-color: var(--link-color); }
  :global(.depth-3 a) { padding-left: 1.5rem !important; }
  :global(.depth-4 a) { padding-left: 2.25rem !important; }
</style>
