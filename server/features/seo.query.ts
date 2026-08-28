import { gqlString } from '~~/server/utils/graphql';

export const sitemapQuery = (blogSlug: string) => {
  return `posts(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      status: { _eq: "published" }
    }
    limit: -1
  ) {
    post_idx
    slug
  }
  categories(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
    }
    limit: -1
  ) {
    slug
    posts_func { count }
  }
  tags(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
    }
    limit: -1
  ) {
    slug
    posts_func { count }
  }
  series(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
    }
    limit: -1
  ) {
    slug
    posts_func { count }
  }`;
};

export const rssQuery = (blogSlug: string) => {
  return `posts(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      status: { _eq: "published" }
    }
    limit: 50
  ) {
    author_id {
      first_name
      last_name
      nickname
    }
    id
    post_idx
    title
    slug
    summary
    content
    published_at
  }`;
};
