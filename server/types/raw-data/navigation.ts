export interface RawNavigationItem {
  label: string;
  url: string | null;
  icon: string | null;
  is_category: boolean;
  parent_id: {
    id: string;
  } | null;
}
