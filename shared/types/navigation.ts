export interface RawNavigationItem {
  label: string;
  url: string | null;
  icon: string | null;
  is_category: boolean;
  parent_id: {
    id: string;
  } | null;
}

export interface NavigationItem {
  label: string;
  slug: string;
  url: string | null;
  icon: string | null;
  isCategory: boolean;
  parentId: string | null;
  children?: NavigationItem[];
}
