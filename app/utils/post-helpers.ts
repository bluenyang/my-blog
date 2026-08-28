/** 글 상세 경로. 슬러그가 붙은 정규 URL을 만든다. */
export function postPath(post: { postIdx: number; slug: string }): string {
  return `/posts/${post.postIdx}-${post.slug}`;
}

/**
 * 한국어 기준 읽는 시간(분).
 *
 * 본문이 있는 글 상세에서만 쓴다 — 목록 쿼리는 성능상 content를 가져오지 않는다.
 * 코드 펜스·링크·마크업 기호를 걷어낸 뒤 한글은 글자 수, 그 외는 단어 수로 센다.
 */
export function readingMinutes(content: string | null | undefined): number {
  if (!content) return 0;

  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_`~|-]/g, ' ');

  const korean = (plain.match(/[가-힣]/g) ?? []).length;
  const words = plain
    .replace(/[가-힣]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  // 한글 500자/분, 영문 220단어/분
  return Math.max(1, Math.round(korean / 500 + words / 220));
}
