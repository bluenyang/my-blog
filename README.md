# BlueNyang's Dev-log

[Nuxt 4](https://nuxt.com) + [Directus](https://directus.io) 기반 개인 개발 블로그입니다.

- 사이트: https://blog.bluenyang.kr
- 배포: Netlify (`nitro.preset: netlify`)

## 스택

| 구분       | 기술                                              |
| ---------- | ------------------------------------------------- |
| 프레임워크 | Nuxt 4 (SSR), Vue 3                               |
| CMS        | Directus (`@directus/sdk` REST)                   |
| 스타일     | Tailwind CSS v4                                   |
| 마크다운   | `@nuxtjs/mdc`                                     |
| 기타       | color-mode, sitemap, robots, RSS (`feed`), VueUse |

패키지 매니저는 **Yarn 4**입니다.

## 아키텍처 요약

페이지·사이드바 데이터는 Nuxt 플러그인(`$directus`)과 composable에서 Directus REST를 직접 호출합니다 (`useAsyncData`로 SSR/클라이언트 캐시).

서버 Nitro 라우트는 RSS·sitemap 생성에만 Directus를 사용합니다.

```
브라우저 / SSR
  └─ composables (use-post, use-category, …)
       └─ $directus (REST)

Nitro
  ├─ /rss.xml
  └─ /api/sitemap-urls
       └─ server Directus client (REST)
```

## 주요 경로

| 경로                | 설명                          |
| ------------------- | ----------------------------- |
| `/`                 | 홈 (최신 글, 시리즈)          |
| `/posts`            | 전체 글 목록                  |
| `/posts/:id`        | 글 상세 (`{post_idx}-{slug}`) |
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
```

| 변수            | 용도                               |
| --------------- | ---------------------------------- |
| `BLOG_URL`      | 사이트 절대 URL (OG, RSS, sitemap) |
| `BLOG_SLUG`     | Directus 블로그 구분 slug          |
| `DIRECTUS_URL`  | Directus API base URL              |
| `EMAIL_ADDRESS` | RSS author 이메일                  |

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

- 다크 모드 기본 (`@nuxtjs/color-mode`)
- 사이드바: 프로필, 카테고리 트리, 시리즈, 태그, 검색, 링크
- MDC 마크다운 렌더링 및 코드 하이라이트
- 카테고리 / 태그 / 시리즈 필터, 검색
- 글 상세 시리즈 목차
- RSS · 동적 sitemap
