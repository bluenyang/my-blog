import { homeQuery, sidebarQuery } from '~~/server/features/query';

export function useQuery() {
  const config = useRuntimeConfig();

  function buildQuery(...queries: string[]) {
    const query = queries.join('\n');
    return `query {\n  ${query}\n}`;
  }

  return {
    buildQuery,
    sidebar: sidebarQuery(config.public.blogSlug),
    home: homeQuery(config.public.blogSlug),
  };
}
