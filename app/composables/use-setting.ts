export function useSetting() {
  const { data } = useNuxtData<SidebarContent>('sidebar');
  const settings = computed(() => data.value?.blogSettings);
  return { settings };
}
