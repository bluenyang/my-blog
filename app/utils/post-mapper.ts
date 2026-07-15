import type { PostItem, RawPostItem } from '~/types/post';
import { rehypeUnwrapImages } from '~/utils/rehype-unwrap';

export async function rawPostsToPostItems(rawPosts: RawPostItem[]): Promise<PostItem[]> {
  return Promise.all(rawPosts.map(rawPostItemToPostItem));
}

export async function rawPostItemToPostItem(rawPostItem: RawPostItem): Promise<PostItem> {
  const postItem: PostItem = {
    id: rawPostItem.id,
    blogId: rawPostItem.blog_id,
    author: rawPostItem.author_id
      ? {
          firstName: rawPostItem.author_id.first_name,
          lastName: rawPostItem.author_id.last_name,
          nickname: rawPostItem.author_id.nickname,
          avatar: rawPostItem.author_id.avatar,
        }
      : undefined,
    postIdx: rawPostItem.post_idx,
    title: rawPostItem.title,
    slug: rawPostItem.slug,
    summary: rawPostItem.summary,
    thumbnail: rawPostItem.thumbnail,
    status: rawPostItem.status,
    visibility: rawPostItem.visibility,
    passwordHash: rawPostItem.password_hash,
    publishedAt: rawPostItem.published_at,
    updatedAt: rawPostItem.updated_at,
    categories:
      rawPostItem.categories?.map((category) => ({
        name: category.categories_id.name,
        slug: category.categories_id.slug,
      })) ?? null,
    tags:
      rawPostItem.tags?.map((tag) => ({
        name: tag.tags_id.name,
        slug: tag.tags_id.slug,
      })) ?? null,
    series:
      rawPostItem.series?.map((series) => ({
        id: series.series_id.id,
        name: series.series_id.name,
        slug: series.series_id.slug,
      })) ?? null,
  };

  if (rawPostItem.content) {
    const ast = await parseMarkdown(rawPostItem.content, {
      rehype: {
        plugins: {
          unwrapImages: {
            instance: rehypeUnwrapImages,
          },
        },
      },
    });
    postItem.content = ast;
  }

  return postItem;
}
