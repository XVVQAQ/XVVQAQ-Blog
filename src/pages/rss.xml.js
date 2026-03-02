import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { config } from "@/config";

export async function GET(context) {
  const posts = await getCollection("blog");

  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: config.site.SITE_TITLE,
    description: config.site.SITE_SUBTITLE,
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>zh-cn</language>`,
    stylesheet: "/rss-style.xsl",
  });
}
