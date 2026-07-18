/** 라우트 파라미터 slug의 이중/단일 인코딩을 풀어 실제 값으로 복원 */
export function decodeRouteSlug(raw: string): string {
  if (!raw) return '';

  let value = raw;
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      break;
    }
  }
  return value;
}
