<script lang="ts">
    import { config } from "@/config";
    import { onMount } from "svelte";

    let container: HTMLDivElement;

    const giscusConfig = config.giscus;
    const enabled = giscusConfig && giscusConfig.repo && giscusConfig.repoId;

    function getTheme(): string {
        const theme = document.documentElement.getAttribute("data-theme");
        return theme === "dark" ? "dark" : "light";
    }

    function loadGiscus() {
        if (!container || !enabled) return;

        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://giscus.app/client.js";
        script.setAttribute("data-repo", giscusConfig!.repo);
        script.setAttribute("data-repo-id", giscusConfig!.repoId);
        script.setAttribute("data-category", giscusConfig!.category);
        script.setAttribute("data-category-id", giscusConfig!.categoryId);
        script.setAttribute(
            "data-mapping",
            giscusConfig!.mapping ?? "pathname",
        );
        script.setAttribute("data-strict", "0");
        script.setAttribute("data-reactions-enabled", "1");
        script.setAttribute("data-emit-metadata", "0");
        script.setAttribute("data-input-position", "top");
        script.setAttribute("data-theme", getTheme());
        script.setAttribute("data-lang", "zh-CN");
        script.setAttribute("data-loading", "lazy");
        script.setAttribute("crossorigin", "anonymous");
        script.async = true;

        container.appendChild(script);
    }

    function syncTheme() {
        if (!container || !enabled) return;
        const giscusTheme = getTheme();

        const iframe = container.querySelector<HTMLIFrameElement>("iframe");
        if (iframe) {
            iframe.contentWindow?.postMessage(
                { giscus: { setConfig: { theme: giscusTheme } } },
                "https://giscus.app",
            );
        }
    }

    onMount(() => {
        if (!enabled) return;

        loadGiscus();

        document.addEventListener("astro:after-swap", loadGiscus);

        const observer = new MutationObserver(syncTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => {
            observer.disconnect();
            document.removeEventListener("astro:after-swap", loadGiscus);
        };
    });
</script>

{#if enabled}
    <div class="giscus-wrapper" bind:this={container}></div>
{/if}

<style>
    .giscus-wrapper {
        margin-top: 3rem;
        padding-top: 2rem;
        padding-bottom: 0.5rem;
        border-top: 1px solid var(--border-color);
    }
</style>
