import type { BlogSetting } from '~~/shared/types/setting';

export function useSetting() {
  const settings = useState<BlogSetting | undefined>('blogSettings', () => undefined);

  function setSettings(newSettings?: BlogSetting) {
    settings.value = newSettings;
  }

  return {
    settings,
    setSettings,
  };
}
