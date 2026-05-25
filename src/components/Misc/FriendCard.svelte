<script lang="ts">
    export let avatar: string;
    export let name: string;
    export let url: string;
    export let description: string | undefined = undefined;
    export let tags: string[] | undefined = undefined;
    export let hoverDescription: string | undefined = undefined;
</script>

<a href={url} target="_blank" rel="noopener noreferrer" class="friend-card">
    {#if hoverDescription}
        <span class="friend-hover">{hoverDescription}</span>
    {/if}
    <div class="friend-avatar">
        <img src={avatar} alt={name} width={48} height={48} loading="lazy" />
    </div>
    <div class="friend-info">
        <div class="friend-name">{name}</div>
        {#if description}
            <div class="friend-desc">{description}</div>
        {/if}
        {#if tags && tags.length > 0}
            <div class="friend-tags">
                {#each tags as tag}
                    <span class="tag">{tag}</span>
                {/each}
            </div>
        {/if}
    </div>
</a>

<style>
    .friend-card {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xs);
        text-decoration: none;
        color: inherit;
        background: var(--bg-color);
        box-shadow: var(--elevation-1);
        transition:
            box-shadow 0.2s,
            border-color 0.2s;
    }

    .friend-card:hover {
        box-shadow: var(--elevation-2);
        border-color: var(--link-color);
    }

    .friend-hover {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%) translateY(4px);
        padding: 0.35rem 0.7rem;
        background: var(--bg-color);
        color: var(--text-color);
        font-size: 0.78rem;
        border-radius: var(--radius-xs);
        border: 1px solid var(--border-color);
        white-space: normal;
        width: max-content;
        max-width: min(260px, calc(100vw - 1.5rem));
        text-align: center;
        pointer-events: none;
        opacity: 0;
        transition:
            opacity 0.2s,
            transform 0.2s;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }

    .friend-card:hover .friend-hover {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    .friend-avatar {
        flex-shrink: 0;
    }
    .friend-avatar img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        display: block;
    }
    .friend-info {
        flex: 1;
        min-width: 0;
    }
    .friend-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.15rem;
    }
    .friend-desc {
        font-size: 0.8rem;
        color: var(--text-secondary);
        line-height: 1.4;
        margin-bottom: 0.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .friend-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }
    .tag {
        display: inline-flex;
        align-items: center;
        padding: 0.1rem 0.4rem;
        border-radius: var(--radius-xs);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        font-size: 0.7rem;
    }
</style>
