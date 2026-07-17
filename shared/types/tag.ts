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

export interface RawTagItemInPost {
  tags_id: {
    name: string;
    slug: string;
  };
}

export interface TagItemInPost {
  name: string;
  slug: string;
}
