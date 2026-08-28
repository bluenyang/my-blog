# BlueNyang's Dev-log

[Nuxt 4](https://nuxt.com) + [Directus](https://directus.io) 기반 개인 개발 블로그입니다.

- 사이트: https://blog.bluenyang.kr
- 배포: Netlify (`nitro.preset: netlify-edge`)

## 스택

| 구분       | 기술                                                |
| ---------- | --------------------------------------------------- |
| 프레임워크 | Nuxt 4 (SSR), Vue 3                                 |
| CMS        | Directus (`@directus/sdk` **GraphQL**)              |
| 스타일     | Tailwind CSS v4 (CSS-first, `tailwind.config` 없음) |
| 마크다운   | `comark` / `@comark/nuxt` + Shiki (one-dark-pro)    |
| 기타       | color-mode, sitemap, robots, RSS (`feed`), VueUse   |
| 도구       | Yarn 4, oxlint + oxfmt, vitest, husky + lint-staged |

## 아키텍처 요약

프론트는 Directus를 직접 호출하지 않습니다. composable이 Nitro `/api/*`를 `useFetch`하고,
서버에서 GraphQL 쿼리를 묶어 Directus에 요청합니다.

```
브라우저 / SSR
  └─ composables (useFetch)
       └─ /api/home | /api/posts | /api/post/:idx | /api/sidebar | /api/search
            └─ server Directus → GraphQL (.query)

Nitro
  ├─ /rss.xml
  └─ /api/sitemap-urls
       └─ 동일 GraphQL 클라이언트
```

| 레이어                         | 역할                                       |
| ------------------------------ | ------------------------------------------ |
| `server/features/*.query.ts`   | GraphQL 쿼리 조각                          |
| `server/features/*.mapper.ts`  | raw → DTO 매핑 (Directus 이미지 변환 포함) |
| `server/utils/directus.ts`     | Directus 클라이언트 + asset URL            |
| `server/utils/graphql.ts`      | 쿼리 문자열 이스케이프                     |
| `server/utils/use-query.ts`    | 쿼리 조합 (`buildQuery`)                   |
| `server/utils/posts-query.ts`  | `/api/posts` 파라미터 파싱 + 캐시 키       |
| `shared/types`, `shared/utils` | 프론트·서버 공유 DTO와 순수 함수           |

### GraphQL 문자열 조립

쿼리를 템플릿 문자열로 만들기 때문에, 사용자 입력(검색어·슬러그)은 **반드시**
`server/utils/graphql.ts`의 `gqlString` / `gqlStringList`를 거쳐야 합니다.
그냥 보간하면 따옴표 하나로 쿼리가 깨지고 필터가 주입됩니다.

## API

| 경로                    | 캐시  | 설명                                                               |
| ----------------------- | ----- | ------------------------------------------------------------------ |
| `GET /api/home`         | 180s  | 홈 (최신 글, 시리즈)                                               |
| `GET /api/posts`        | 180s  | 글 목록 (`limit` 1–50, `page`, `search`/`category`/`tag`/`series`) |
| `GET /api/post/:idx`    | 300s  | 글 상세 (`post_idx`). 없으면 404                                   |
| `GET /api/sidebar`      | 600s  | 카테고리 트리, 시리즈, 태그(상위 20), 내비게이션, 블로그 설정      |
| `GET /api/search`       | 120s  | ⌘K 팔레트용 경량 검색 (2자 이상)                                   |
| `GET /api/sitemap-urls` | 3600s | sitemap URL 소스                                                   |
| `GET /rss.xml`          | 3600s | RSS 피드 (routeRules SWR)                                          |

## 주요 경로

| 경로                | 설명                          |
| ------------------- | ----------------------------- |
| `/`                 | 홈 (최신 글, 시리즈)          |
| `/posts`            | 전체 글 목록 (페이지네이션)   |
| `/posts/:idx`       | 글 상세 (`{post_idx}-{slug}`) |
| `/categories/:slug` | 카테고리별 글                 |
| `/tags`             | 태그 클라우드 (상위 20)       |
| `/tags/:slug`       | 태그별 글                     |
| `/series`           | 시리즈 목록                   |
| `/series/:slug`     | 시리즈별 글                   |
| `/search`           | 텍스트 검색                   |
| `/license`          | CCL 라이선스 안내             |
| `/rss.xml`          | RSS 피드                      |

## 환경 변수

`.env.example`을 복사해 채웁니다. 각 변수의 용도는 그 파일의 주석을 참고하세요.

```bash
cp .env.example .env
```

> `runtimeConfig.public` 값은 **빌드 시점에 번들에 구워집니다.** 배포 플랫폼의
> 런타임 환경변수만 바꿔서는 반영되지 않으니 빌드 환경에 설정해야 합니다.

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
yarn lint       # oxlint (--fix 포함)
yarn format     # oxfmt
yarn test       # vitest (순수 함수 단위 테스트)
```

CI(GitHub Actions)가 push/PR마다 typecheck → lint → format → test → build를 돌립니다.

## 캐시

두 계층이 있습니다.

1. **Nitro 응답 캐시** — `/api/*` 핸들러의 `defineCachedEventHandler`. 위 API 표의 캐시 열 참고.
   `/api/posts`의 캐시 키는 클램프된 파라미터로 만들어지므로 `?limit=abc`가 기본값과 같은 키를 씁니다.
2. **페이지 SWR** — `routeRules`. `/` `/posts` `/posts/**` `/categories/**` `/tags/**`
   `/series/**` `/search` 180초, `/tags` `/series` 600초, `/license` 86400초, `/rss.xml` 3600초.

`/api/*`에는 `routeRules` SWR을 걸지 않습니다 — `defineCachedEventHandler`가 응답에
`cache-control: no-cache`를 직접 써서 덮여버리기 때문입니다.

## 주요 기능

- 서버 통합 GraphQL 조회 (홈 / 목록 / 상세 / 검색 / sitemap / RSS)
- ⌘K 검색 팔레트 — 글은 서버 검색, 태그·시리즈는 사이드바 데이터로 매칭
- 카테고리(트리) / 태그 / 시리즈 필터, 페이지네이션(`?page=`)
- 구조화 데이터: `WebSite`, `Blog`, `BlogPosting`, `BreadcrumbList`, `CollectionPage`
- canonical, `rel=prev/next`, 2페이지 이후 `noindex, follow`
- 읽는 시간(한국어 기준), 헤더 독 안의 읽기 진행률 바
- 이전/다음 글, TOC 활성 하이라이트
- comark + Shiki 렌더링, prose 컴포넌트(코드 복사, 제목 앵커, 콜아웃, 이미지 figure)
- Directus 이미지 변환 (목록 w960 / 커버 w1280 / 본문 w1280, 전부 webp)
- 다크 모드 기본 (`@nuxtjs/color-mode`)
- 날짜는 KST로 고정 해석 — 서버 타임존이 달라도 같은 날짜를 표시합니다
