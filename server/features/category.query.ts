import { gqlString } from '~~/server/utils/graphql';

export function categoryQuery(blogSlug: string, categorySlug: string) {
  return `categories(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      slug: { _eq: ${gqlString(categorySlug)} }
    }
  ) {
    name
    slug
    posts_func { count }
  }`;
}

export function categoryTreeQuery(blogSlug: string) {
  return `categories(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
    }
  ) {
    slug
    parent_id { slug }
  }`;
}
