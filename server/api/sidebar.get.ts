import { sidebarMapper } from '~~/server/features/mapper';
import type { RawSidebarContent } from '~~/server/types/raw-data';
import type { SidebarContent } from '~~/shared/types';

export default defineCachedEventHandler(
  async (): Promise<SidebarContent> => {
    const directus = useDirectus();
    const { buildQuery, sidebar } = useQuery();

    try {
      const result = await directus.query<RawSidebarContent>(buildQuery(sidebar));

      return sidebarMapper(result);
    } catch (error) {
      console.error('Failed to fetch sidebar:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch sidebar',
      });
    }
  },
  {
    name: 'sidebar',
    maxAge: 600,
    swr: true,
    getKey: () => 'sidebar',
  },
);
