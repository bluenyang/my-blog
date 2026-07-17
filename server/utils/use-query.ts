import { homeQuery, postDetailQuery, sidebarQuery } from '~~/server/features/query';

export function useQuery() {
  const config = useRuntimeConfig();

  function buildQuery(...queries: (string | undefined)[]) {
    const query = queries.filter(Boolean).join('\n');
    return `query {\n  ${query}\n}`;
  }

  return {
    buildQuery,
    sidebar: sidebarQuery(config.public.blogSlug),
    home: homeQuery(config.public.blogSlug),
    postDetail: (postIdx: number) => postDetailQuery(config.public.blogSlug, postIdx),
  };
}
