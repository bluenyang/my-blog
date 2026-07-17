export interface NavigationItem {
  label: string;
  slug: string;
  url: string | null;
  icon: string | null;
  isCategory: boolean;
  parentId: string | null;
  children?: NavigationItem[];
}
