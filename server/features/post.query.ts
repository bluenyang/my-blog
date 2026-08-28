import { gqlString, gqlStringList } from '~~/server/utils/graphql';

export interface PostsFilterOptions {
  search?: string;
  categories?: string[];
  tag?: string;
  series?: string;
}

/**
 * posts(...)와 posts_aggregated(...)가 같은 필터를 쓰도록 한 곳에서 조립한다.
 * 목록/집계/검색이 서로 다른 조건으로 어긋나면 총계와 페이지가 맞지 않는다.
 */
export function postsFilter(blogSlug: string, options: PostsFilterOptions = {}) {
  const { search, categories, tag, series } = options;

  return [
    `blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }`,
    `status: { _eq: "published" }`,
    search
      ? `_or: [{ title: { _contains: ${gqlString(search)} } }, { summary: { _contains: ${gqlString(search)} } }, { content: { _contains: ${gqlString(search)} } }]`
      : '',
    categories?.length
      ? `categories: { categories_id: { slug: { _in: ${gqlStringList(categories)} } } }`
      : '',
    tag ? `tags: { tags_id: { slug: { _eq: ${gqlString(tag)} } } }` : '',
    series ? `series: { series_id: { slug: { _eq: ${gqlString(series)} } } }` : '',
  ]
    .filter(Boolean)
    .join('\n    ');
}

export function postDetailQuery(blogSlug: string, postIdx: number) {
  return `posts(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      post_idx: { _eq: "${postIdx}" }
      status: { _eq: "published" }
    }
    sort: ["published_at"]
  ) {
    author_id {
      first_name
      last_name
      avatar { id }
      nickname
    }
    post_idx
    title
    slug
    summary
    thumbnail { id }
    content
    published_at
    updated_at
    categories {
      categories_id {
        name
        slug
      }
    }
    tags {
      tags_id {
        name
        slug
      }
    }
    series {
      series_id {
        name
        slug
        posts_func { count }
        posts {
          posts_id {
            post_idx
            title
            slug
          }
        }
      }
    }
  }
  prevPost: posts(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      status: { _eq: "published" }
      post_idx: { _lt: "${postIdx}" }
    }
    sort: ["-post_idx"]
    limit: 1
  ) {
    post_idx
    title
    slug
  }
  nextPost: posts(
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      status: { _eq: "published" }
      post_idx: { _gt: "${postIdx}" }
    }
    sort: ["post_idx"]
    limit: 1
  ) {
    post_idx
    title
    slug
  }`;
}

export function postsQuery(
  blogSlug: string,
  limit: number,
  offset: number,
  search?: string,
  categories?: string[],
  tag?: string,
  series?: string,
) {
  const filter = postsFilter(blogSlug, { search, categories, tag, series });

  return `posts(
    sort: ["-published_at"]
    filter: { ${filter} }
    limit: ${limit}
    offset: ${offset}
  ) {
    author_id {
      first_name
      last_name
      avatar { id }
      nickname
    }
    post_idx
    title
    slug
    summary
    thumbnail { id }
    published_at
    updated_at
    categories {
      categories_id {
        name
        slug
      }
    }
    tags {
      tags_id {
        name
        slug
      }
    }
    series {
      series_id {
        name
        slug
      }
    }
  }
  postsCount: posts_aggregated(
    filter: { ${filter} }
  ) {
    count { id }
  }`;
}
