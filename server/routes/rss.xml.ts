import { Feed } from 'feed';

import type { DirectusPost } from '../types/rss';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const blogUrl = config.public.blogUrl || '';
  const blogSlug = config.public.blogSlug || '';
  const directusUrl = config.public.directusUrl || '';
  const emailAddress = config.public.emailAddress || '';

  const resp = await $fetch<{ data: DirectusPost[] }>(`${directusUrl}/items/posts`, {
    query: {
      filter: {
        status: { _eq: 'published' },
        blog_id: { slug: { _eq: blogSlug } },
      },
      fields: ['id', 'title', 'slug', 'post_idx', 'summary', 'content', 'published_date'],
      sort: ['-published_date'],
      limit: 50,
    },
  });

  const posts = resp.data || [];

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
      date: new Date(post.published_date),
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
