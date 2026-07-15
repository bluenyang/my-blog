export interface DirectusPost {
  id: string;
  title: string;
  slug: string;
  post_idx: number;
  summary: string;
  content: string;
  published_at: string | null;
}
