import { profileData } from '~/constants/sidebar-data';

/**
 * 블로그와 저자의 단일 정체성.
 *
 * 1인 블로그이므로 글마다 저자를 파생하지 않고 안정적인 Person 노드 하나를 쓴다.
 * 검색엔진이 엔티티로 인식하려면 같은 @id/sameAs가 반복돼야 한다.
 */
export function useBlogIdentity() {
  const config = useRuntimeConfig();

  const blogUrl = config.public.blogUrl;
  const homepageUrl = config.public.homepageUrl || blogUrl;
  const siteName = "BlueNyang's Dev-log";

  // rss처럼 상대 경로인 항목은 sameAs에서 제외한다 (절대 URL만 의미가 있다)
  const sameAs = profileData.link
    .filter((link) => link.url.startsWith('http'))
    .map((link) => link.url);

  const author = {
    '@type': 'Person',
    '@id': `${homepageUrl}#person`,
    name: profileData.nickname,
    url: homepageUrl,
    image: profileData.githubProfileImage,
    sameAs,
  } satisfies Record<string, unknown>;

  return {
    siteName,
    description: profileData.desc,
    blogUrl,
    homepageUrl,
    author,
  };
}
