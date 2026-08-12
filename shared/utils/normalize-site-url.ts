/** BLOG_URL 등 사이트 절대 URL에 프로토콜이 없으면 https:// 를 붙임 */
export function normalizeSiteUrl(url?: string): string {
  if (!url) return '';

  const trimmed = url.replace(/\/+$/, '');
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
