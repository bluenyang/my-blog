export interface RawSeriesItem {
  name: string;
  slug: string;
  description: string;
  thumbnail: {
    id: string;
  } | null;
  posts_func: {
    count: number;
  };
}

export interface RawSeriesItemInPost {
  series_id: {
    name: string;
    posts_func: {
      count: number;
    };
    posts: {
      posts_id: {
        post_idx: number;
        title: string;
        slug: string;
      };
    }[];
  };
}

export interface SeriesItem {
  name: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  postCount?: number;
}

export interface SeriesItemInPost {
  name: string;
  postCount?: number;
  posts: {
    postIdx: number;
    slug: string;
    title: string;
  }[];
}
