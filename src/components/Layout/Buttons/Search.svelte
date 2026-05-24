<script>
    import { onMount } from "svelte";

    let dialog;
    let searchInput;
    let query = "";
    let results = [];
    let pagefind = null;
    let loading = false;
    let isOpen = false;

    onMount(async () => {
        try {
            const path = "/pagefind/pagefind.js";
            pagefind = await import(/* @vite-ignore */ path);
            await pagefind.init();
        } catch (e) {
            console.warn(
                "Pagefind not available, run a build first to generate the index.",
            );
        }
    });

    function open() {
        dialog.showModal();
        isOpen = true;
        query = "";
        results = [];
        requestAnimationFrame(() => searchInput?.focus());
    }

    function close() {
        isOpen = false;
        setTimeout(() => {
            dialog.close();
        }, 200);
    }

    async function search() {
        if (!pagefind || !query.trim()) {
            results = [];
            return;
        }
        loading = true;
        const search = await pagefind.search(query);
        results = await Promise.all(
            search.results.slice(0, 10).map((r) => r.data()),
        );
        loading = false;
    }

    function handleKeydown(e) {
        if (e.key === "Escape") close();
    }

    function handleDialogClick(e) {
        if (e.target === dialog) {
            close();
        }
    }

    $: if (query !== undefined) {
        search();
    }
</script>

<button class="search-trigger" on:click={open} aria-label="Open Search">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
</button>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
    bind:this={dialog}
    class="search-dialog"
    class:open={isOpen}
    on:keydown={handleKeydown}
    on:click={handleDialogClick}
>
    <div class="search-container">
        <div class="search-header">
            <input
                type="text"
                bind:this={searchInput}
                bind:value={query}
                placeholder="输入关键词搜索..."
                class="search-input"
            />
            <button class="close-btn" on:click={close} aria-label="关闭搜索"
                >✕</button
            >
        </div>

        <div class="search-results">
            {#if loading}
                <p class="search-status">搜索中...</p>
            {:else if query && results.length === 0}
                <p class="search-status">没有找到相关结果</p>
            {:else if results.length > 0}
                {#each results as result}
                    <a href={result.url} class="result-item" on:click={close}>
                        <span class="result-title"
                            >{result.meta?.title || result.url}</span
                        >
                        {#if result.excerpt}
                            <span class="result-excerpt"
                                >{@html result.excerpt}</span
                            >
                        {/if}
                    </a>
                {/each}
            {/if}
        </div>

        <div class="search-footer">
            <span class="powered-by"
                >Powered By <a
                    href="https://pagefind.app"
                    target="_blank"
                    rel="noopener noreferrer">Pagefind</a
                ></span
            >
        </div>
    </div>
</dialog>

<style>
    .search-trigger {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.35rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-xs);
        transition: background 0.2s;
        color: var(--text-secondary);
    }

    .search-trigger:hover {
        background: var(--surface-color);
        color: var(--text-color);
    }

    .search-trigger svg {
        width: 18px;
        height: 18px;
    }

    .search-dialog {
        border: none;
        border-radius: var(--radius-xs);
        padding: 0;
        width: min(480px, 90vw);
        max-height: 65vh;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        overflow: hidden;
        opacity: 0;
        transform: scale(0.95) translateY(-12px);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        background: var(--bg-color);
        color: var(--text-color);
    }

    .search-dialog.open {
        opacity: 1;
        transform: scale(1) translateY(0);
    }

    .search-dialog::backdrop {
        background: rgba(0, 0, 0, 0);
        transition: background 0.2s ease-out;
    }

    .search-dialog.open::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }

    .search-container {
        display: flex;
        flex-direction: column;
        max-height: 65vh;
    }

    .search-header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        padding: 0.5rem 0.75rem;
        gap: 0.5rem;
    }

    .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 0.9rem;
        padding: 0.35rem 0;
        background: none;
        color: var(--text-color);
    }

    .search-input::placeholder {
        color: var(--text-secondary);
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0.25rem;
        border-radius: var(--radius-xs);
        transition: background 0.2s, color 0.2s;
    }

    .close-btn:hover {
        background: var(--surface-color);
        color: var(--text-color);
    }

    .search-results {
        overflow-y: auto;
        padding: 0;
    }

    .search-status {
        text-align: center;
        color: var(--text-secondary);
        padding: 2.5rem 0;
        margin: 0;
        font-size: 0.85rem;
    }

    .result-item {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        padding: 0.65rem 0.75rem;
        text-decoration: none;
        color: inherit;
        border-bottom: 1px solid var(--border-color);
        transition: background 0.15s;
    }

    .result-item:last-child {
        border-bottom: none;
    }

    .result-item:hover {
        background: var(--surface-color);
    }

    .result-title {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-color);
    }

    .result-excerpt {
        font-size: 0.8rem;
        color: var(--text-secondary);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    :global(.result-excerpt mark) {
        background: transparent;
        color: var(--link-color);
        font-weight: 600;
    }

    .search-footer {
        border-top: 1px solid var(--border-color);
        padding: 0.4rem 0.75rem;
        display: flex;
        justify-content: flex-end;
    }

    .powered-by {
        font-size: 0.7rem;
        color: var(--text-secondary);
        opacity: 0.6;

        a {
            color: var(--text-secondary);
        }
    }
</style>
