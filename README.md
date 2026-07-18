# BlueNyang's Dev-log

[Nuxt 4](https://nuxt.com) + [Directus](https://directus.io) 기반 개인 개발 블로그입니다.

- 사이트: https://blog.bluenyang.kr
- 배포: Netlify (`nitro.preset: netlify`)

## 스택

| 구분       | 기술                                              |
| ---------- | ------------------------------------------------- |
| 프레임워크 | Nuxt 4 (SSR), Vue 3                               |
| CMS        | Directus (`@directus/sdk` **GraphQL**)            |
| 스타일     | Tailwind CSS v4                                   |
| 마크다운   | `@nuxtjs/mdc`                                     |
| 기타       | color-mode, sitemap, robots, RSS (`feed`), VueUse |

패키지 매니저는 **Yarn 4**입니다.

## 아키텍처 요약

프론트는 Directus를 직접 호출하지 않습니다. composable이 Nitro `/api/*`를 `useFetch`하고, 서버에서 GraphQL 쿼리를 묶어 Directus에 요청합니다.

사이드바는 전용 API 없이, 각 콘텐츠 API에 `?sidebar=true`로 함께 받아 `useSidebar`에 캐시합니다.

```
브라우저 / SSR
  └─ composables (useFetch)
       └─ /api/home | /api/posts | /api/post/:idx
            └─ server Directus → GraphQL (.query)

Nitro
  ├─ /rss.xml
  └─ /api/sitemap-urls
       └─ 동일 GraphQL 클라이언트
```

| 레이어                        | 역할                     |
| ----------------------------- | ------------------------ |
| `server/features/*.query.ts`  | GraphQL 쿼리 조각        |
| `server/features/*.mapper.ts` | raw → DTO 매핑           |
| `server/utils/directus.ts`    | Directus 클라이언트      |
| `server/utils/use-query.ts`   | 쿼리 조합 (`buildQuery`) |
| `shared/types`                | 프론트·서버 공유 DTO     |

## API

| 경로                    | 설명                                                                           |
| ----------------------- | ------------------------------------------------------------------------------ |
| `GET /api/home`         | 홈 (최신 글, 시리즈). `?sidebar=true` 선택                                     |
| `GET /api/posts`        | 글 목록 (`limit`, `page`, `search`/`category`/`tag`/`series`, `?sidebar=true`) |
| `GET /api/post/:idx`    | 글 상세 (`post_idx`). `?sidebar=true` 선택                                     |
| `GET /api/sitemap-urls` | sitemap URL 소스                                                               |
| `GET /rss.xml`          | RSS 피드                                                                       |

## 주요 경로

| 경로                | 설명                          |
| ------------------- | ----------------------------- |
| `/`                 | 홈 (최신 글, 시리즈)          |
| `/posts`            | 전체 글 목록 (페이지네이션)   |
| `/posts/:idx`       | 글 상세 (`{post_idx}-{slug}`) |
| `/categories/:slug` | 카테고리별 글                 |
| `/tags/:slug`       | 태그별 글                     |
| `/series/:slug`     | 시리즈별 글                   |
| `/search`           | 텍스트 검색                   |
| `/rss.xml`          | RSS 피드                      |

## 환경 변수

`.env` 예시:

```env
BLOG_URL=https://blog.bluenyang.kr
BLOG_SLUG=bluenyang
DIRECTUS_URL=https://your-directus.example
EMAIL_ADDRESS=you@example.com
HOMEPAGE_URL=https://www.bluenyang.kr
```

| 변수            | 용도                               |
| --------------- | ---------------------------------- |
| `BLOG_URL`      | 사이트 절대 URL (OG, RSS, sitemap) |
| `BLOG_SLUG`     | Directus 블로그 구분 slug          |
| `DIRECTUS_URL`  | Directus API base URL              |
| `EMAIL_ADDRESS` | RSS author 이메일                  |
| `HOMEPAGE_URL`  | 개인 홈페이지 URL (RSS 등)         |

## 개발

```bash
yarn install
yarn dev
```

로컬: http://localhost:3000

```bash
yarn build      # 프로덕션 빌드
yarn preview    # 빌드 미리보기
yarn typecheck  # 타입 검사
yarn lint       # ESLint
```

## 캐시

주요 페이지에 SWR **180초** (`routeRules`)가 적용되어 있습니다.

- `/`, `/posts`, `/posts/**`
- `/categories/**`, `/tags/**`, `/series/**`
- `/search`

## 주요 기능

- 서버 통합 GraphQL 조회 (홈 / 목록 / 상세 / sitemap / RSS)
- 목록 페이지네이션 (`totalCount` + `Pagination`)
- 사이드바 데이터 페이지 응답에 합쳐 전달
- SEO meta (`useSeoMeta`)
- 다크 모드 기본 (`@nuxtjs/color-mode`)
- 사이드바: 프로필, 카테고리 트리, 시리즈, 태그, 검색, 링크
- MDC 마크다운 렌더링 및 코드 하이라이트
- 카테고리 / 태그 / 시리즈 필터, 검색
- 글 상세 시리즈 목차
