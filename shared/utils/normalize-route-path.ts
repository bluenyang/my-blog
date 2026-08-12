import { decodeRouteSlug } from './decode-route-slug';

/** route.path 와 canonical path 비교용 — 이중 인코딩·슬래시 차이를 정규화 */
export function normalizeRoutePath(path: string): string {
  if (!path) return '';

  const withoutTrailingSlash = path.replace(/\/+$/, '') || '/';
  return decodeRouteSlug(withoutTrailingSlash);
}
