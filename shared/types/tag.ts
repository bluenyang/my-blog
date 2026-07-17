export interface RawTagItem {
  name: string;
  slug: string;
  posts_func: {
    count: number;
  };
}

export interface TagItem {
  name: string;
  slug: string;
  postCount?: number;
}

export interface TagLabel {
  name: string;
  slug: string;
}
