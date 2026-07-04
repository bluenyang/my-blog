export interface RawPostForSitemap {
  data: {
    posts: {
      post_idx: number | string;
      slug: string;
    }[];
    categories: {
      slug: string;
    }[];
    series: {
      slug: string;
    }[];
  };
}

export interface PostForSitemap {
  postIdx: number;
  slug: string;
}

export interface DataForSitemap {
  slug: string;
}
