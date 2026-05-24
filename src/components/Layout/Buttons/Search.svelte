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
        border-radius: 0;
        padding: 0;
        width: min(560px, 90vw);
        max-height: 70vh;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        opacity: 0;
        transform: scale(0.9) translateY(-30px);
        transition:
            opacity 0.25s ease-out,
            transform 0.25s ease-out;
        background-color: var(--bg-color);
        color: var(--text-color);
    }

    .search-dialog.open {
        opacity: 1;
        transform: scale(1) translateY(0);
    }

    .search-dialog::backdrop {
        background: rgba(0, 0, 0, 0);
        transition: background 0.25s ease-out;
    }

    .search-dialog.open::backdrop {
        background: rgba(0, 0, 0, 0.4);
    }

    .search-container {
        display: flex;
        flex-direction: column;
        max-height: 70vh;
    }

    .search-header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        padding: 0.75rem 1rem;
        gap: 0.5rem;
    }

    .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 1rem;
        padding: 0.25rem 0;
        background: none;
        color: var(--text-color);
    }

    .search-input::placeholder {
        color: var(--text-color);
        opacity: 0.5;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.1rem;
        cursor: pointer;
        color: var(--text-color);
        padding: 0.25rem;
        opacity: 0.6;
    }

    .close-btn:hover {
        opacity: 1;
    }

    .search-results {
        overflow-y: auto;
        padding: 0;
    }

    .search-status {
        text-align: center;
        color: var(--text-color);
        opacity: 0.6;
        padding: 2rem 0;
        margin: 0;
    }

    .result-item {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 0.75rem 1rem;
        text-decoration: none;
        color: inherit;
        transition: background 0.15s;
        border-bottom: 1px solid var(--border-color);
    }

    .result-item:last-child {
        border-bottom: none;
    }

    .result-item:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    :global([data-theme="dark"]) .result-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .result-title {
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--text-color);
    }

    .result-excerpt {
        font-size: 0.85rem;
        color: var(--text-color);
        opacity: 0.7;
        line-height: 1.4;
    }

    :global(.result-excerpt mark) {
        background: #fef08a;
        color: inherit;
        border-radius: 2px;
        padding: 0 1px;
    }

    .search-footer {
        border-top: 1px solid var(--border-color);
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: flex-end;
    }

    .powered-by {
        font-size: 0.75rem;
        color: var(--text-color);
    }
</style>
