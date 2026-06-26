export interface NavigationItem {
  id: string;
  label: string;
  url: string | null;
  icon: string | null;
  isCategory: boolean;
  parentId: string | null;
  children?: NavigationItem[];
}

export interface NavigationListResponse {
  id: string;
  label: string;
  url: string | null;
  icon: string | null;
  is_category: boolean;
  parent_id: string | null;
  children?: NavigationItem[];
}
