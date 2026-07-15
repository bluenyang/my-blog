import { readItems } from '@directus/sdk';
import { Feed } from 'feed';

import type { DirectusPost } from '../types/rss';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const directus = useDirectus();

  const blogUrl = config.public.blogUrl || '';
  const blogSlug = config.public.blogSlug || '';
  const emailAddress = config.public.emailAddress || '';

  const posts =
    (await directus.request<DirectusPost[]>(
      readItems('posts', {
        filter: {
          status: { _eq: 'published' },
          blog_id: { slug: { _eq: blogSlug } },
        },
        fields: ['id', 'title', 'slug', 'post_idx', 'summary', 'content', 'published_at'],
        sort: ['-published_at'],
        limit: 50,
      }),
    )) || [];

  const feed = new Feed({
    title: "BlueNyang's Devlog",
    description: 'BlueNyang의 개발 log',
    id: blogUrl,
    link: blogUrl,
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
      id: `${blogUrl}/posts/${post.post_idx}-${post.slug}`,
      link: `${blogUrl}/posts/${post.post_idx}-${post.slug}`,
      description: post.summary,
      content: post.content,
      date: new Date(post.published_at || Date.now()),
      author: [
        {
          name: 'BlueNyang',
          email: emailAddress,
          link: blogUrl,
        },
      ],
    });
  });

  setHeader(event, 'content-type', 'application/xml; charset=utf-8');
  return feed.rss2();
});
