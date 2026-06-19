export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  children?: NavigationItem[];
}
