import { gqlString } from '~~/server/utils/graphql';

export function seriesQuery(blogSlug: string, seriesSlug: string) {
  return `series(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      slug: { _eq: ${gqlString(seriesSlug)} }
    }
  ) {
    name
    slug
    description
    thumbnail { id }
    posts_func { count }
  }`;
}
