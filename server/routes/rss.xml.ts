import { Feed } from 'feed';

import { rssMapper } from '~~/server/features/mapper';
import type { RawRssPosts } from '~~/server/types/rss';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const directus = useDirectus();

  const { buildQuery, rss } = useQuery();

  const homepageUrl = config.public.homepageUrl || '';
  const blogUrl = config.public.blogUrl || '';
  const emailAddress = config.public.emailAddress || '';

  const resp = await directus.query<RawRssPosts>(buildQuery(rss));
  const posts = rssMapper(resp);

  const feed = new Feed({
    title: "BlueNyang's Devlog",
    description: 'BlueNyang의 개발 log',
    id: blogUrl,
    link: homepageUrl || blogUrl,
    language: 'ko-KR',
    image: `${blogUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, BlueNyang`,
    generator: 'Nuxt 3 Nitro Engine',
    feedLinks: {
      rss2: `${blogUrl}/rss.xml`,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: post.id,
      link: `${blogUrl}/posts/${post.postIdx}-${post.slug}`,
      description: post.summary || '',
      content: post.content || '',
      date: post.publishedAt,
      author: [
        {
          name: post.author,
          email: emailAddress,
          link: homepageUrl || blogUrl,
        },
      ],
    });
  });

  setHeader(event, 'content-type', 'application/xml; charset=utf-8');
  return feed.rss2();
});
