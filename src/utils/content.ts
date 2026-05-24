import { getCollection } from "astro:content";

export async function getSortedPosts() {
  const posts = await getCollection("blog");

  const pinnedPosts = posts
    .filter((post) => post.data.pin && post.data.pin > 0)
    .sort((a, b) => (b.data.pin ?? 0) - (a.data.pin ?? 0));

  const otherPosts = posts
    .filter((post) => !post.data.pin)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const allPosts = [...pinnedPosts, ...otherPosts];
  return allPosts;
}

function normalizeTagKey(tag: string) {
  return tag.trim().toLowerCase();
}

export function tagKeyToSlug(tagKey: string) {
  return tagKey;
}

export function tagSlugToKey(tagSlug: string) {
  return tagSlug;
}

export function tagLabelToSlug(tagLabel: string) {
  return normalizeTagKey(tagLabel);
}

export async function getTagIndex() {
  const posts = await getCollection("blog");

  const counts = new Map<string, { label: string; count: number }>();

  for (const post of posts) {
    const tags = Array.isArray(post.data.tags) ? post.data.tags : [];
    for (const tag of tags) {
      if (typeof tag !== "string") continue;
      const label = tag.trim();
      const key = normalizeTagKey(label);
      if (!key) continue;

      const current = counts.get(key);
      if (current) {
        current.count += 1;
      } else {
        counts.set(key, { label, count: 1 });
      }
    }
  }

  return [...counts.entries()]
    .map(([key, { label, count }]) => ({
      key,
      label,
      slug: tagKeyToSlug(key),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export async function getPostsByTagKey(tagKey: string) {
  const key = normalizeTagKey(tagKey);
  const posts = await getSortedPosts();
  return posts.filter((post) => {
    const tags = Array.isArray(post.data.tags) ? post.data.tags : [];
    return tags.some(
      (t) => typeof t === "string" && normalizeTagKey(t) === key,
    );
  });
}
