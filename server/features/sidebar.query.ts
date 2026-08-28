import { gqlString } from '~~/server/utils/graphql';

export function sidebarQuery(blogSlug: string) {
  return `sidebarPostCount: posts_aggregated(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      status: { _eq: "published" }
    }
  ) {
    count { id }
  }
  sidebarCategories: categories(
    sort: ["sort_order", "slug"]
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
    }
  ) {
    id
    parent_id { id }
    name
    icon
    slug
    posts_func { count }
  }
  sidebarSeries: series(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
    }
  ) {
    id
    name
    slug
    description
    thumbnail { id }
    posts_func { count }
  }
  sidebarTags: tags(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
    }
    limit: -1
  ) {
    id
    name
    slug
    posts_func { count }
  }
  sidebarNavigations: navigations(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
    }
    sort: ["sort_order", "label"]
  ) {
    id
    label
    url
    icon
    is_category
    parent_id { id }
  }
  blogSettings: blog_settings(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
    }
  ) {
    allow_ccl
    allow_commercial
    change_content
    license_note
  }`;
}
