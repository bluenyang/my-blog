export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  parent_id: string | null;
  children?: NavigationItem[];
}
