import { gqlString } from '~~/server/utils/graphql';

export function tagQuery(blogSlug: string, tagSlug: string) {
  return `tags(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      slug: { _eq: ${gqlString(tagSlug)} }
    }
  ) {
    name
    slug
    posts_func { count }
  } `;
}
