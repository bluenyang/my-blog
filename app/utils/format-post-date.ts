/**
 * Directus는 published_at을 오프셋 없는 문자열("2026-08-27T01:02:17")로 준다.
 * 이걸 그대로 new Date()에 넣으면 **실행 환경의 타임존**으로 해석되므로,
 * UTC 서버(Netlify)에서는 8/27, 한국 브라우저에서는 8/26이 되어
 * 표시 날짜가 하루 어긋나고 하이드레이션 불일치까지 난다.
 *
 * 저장 값이 KST이므로 오프셋이 없으면 +09:00을 붙여 해석하고, 표시도 KST로 고정한다.
 * 그래야 서버와 클라이언트가 같은 값을 낸다.
 */
const KST_OFFSET = '+09:00';
const KST_TIME_ZONE = 'Asia/Seoul';

const HAS_OFFSET = /(?:Z|[+-]\d{2}:?\d{2})$/;

export function parsePostDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  const normalized = HAS_OFFSET.test(dateString) ? dateString : `${dateString}${KST_OFFSET}`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

const ymdFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: KST_TIME_ZONE,
});

const longFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  timeZone: KST_TIME_ZONE,
});

export function formatPostDateYmd(dateString: string | null | undefined): string {
  const date = parsePostDate(dateString);
  // en-CA는 YYYY-MM-DD를 준다
  return date ? ymdFormatter.format(date) : '';
}

export function formatPostDateLong(dateString: string | null | undefined): string {
  const date = parsePostDate(dateString);
  return date ? longFormatter.format(date) : '';
}
