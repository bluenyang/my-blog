export function postDetailQuery(blogSlug: string, postIdx: number) {
  return `posts(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
      post_idx: { _eq: "${postIdx}" }
      status: { _eq: "published" }
    }
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
        posts_func { count }
        posts {
          posts_id{
            post_idx
            title
            slug
          }
        }
      }
    }
  }`;
}
