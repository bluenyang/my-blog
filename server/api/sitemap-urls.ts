import type { PostForSitemap, RawPostForSitemap } from '../types/sitemap';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const directusUrl = config.public.directusUrl;

  const query = `
    query {
      posts(filter: {blog_id: {slug: {_eq: "${config.public.blogSlug}"}}, status: {_eq: "published" }}, limit: -1) { post_idx, slug }
      categories(filter: {blog_id: {slug: {_eq: "${config.public.blogSlug}"}}}, limit: -1) { slug }
      series(filter: {blog_id: {slug: {_eq: "${config.public.blogSlug}"}}}, limit: -1) { slug }
    }
  `;

  try {
    const { data } = await $fetch<RawPostForSitemap>(`${directusUrl}/graphql`, {
      method: 'POST',
      body: { query },
    });

    const { posts, categories, series } = data;

    const postData: PostForSitemap[] = posts.map((post) => ({
      postIdx: Number(post.post_idx),
      slug: post.slug,
    }));

    const postMapUrls = postData.map((post) => ({
      loc: `posts/${post.postIdx}-${post.slug}`,
      _path: `posts/${post.postIdx}-${post.slug}`,
    }));

    const categoryMapUrls = categories.map((category) => ({
      loc: `categories/${category.slug}`,
      _path: `categories/${category.slug}`,
    }));

    const seriesMapUrls = series.map((series) => ({
      loc: `series/${series.slug}`,
      _path: `series/${series.slug}`,
    }));

    return [...postMapUrls, ...categoryMapUrls, ...seriesMapUrls];
  } catch (error) {
    console.error('Failed to fetch sitemap URLs:', error);
    return [];
  }
});
