export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  is_category: boolean;
  parent_id: string | null;
  children?: NavigationItem[];
}
