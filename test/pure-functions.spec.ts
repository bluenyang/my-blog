import { describe, expect, it } from 'vitest';

import { formatPostDateLong, formatPostDateYmd, parsePostDate } from '~/utils/format-post-date';
import { readingMinutes } from '~/utils/post-helpers';
import { calculatePostCount } from '~~/server/features/category.mapper';
import { escapeGraphQLString, gqlString, gqlStringList } from '~~/server/utils/graphql';
import { buildTree } from '~~/shared/utils/build-tree';
import { decodeRouteSlug } from '~~/shared/utils/decode-route-slug';
import { normalizeRoutePath } from '~~/shared/utils/normalize-route-path';
import { resolveSearchType } from '~~/shared/utils/resolve-search-type';

describe('escapeGraphQLString', () => {
  it('따옴표와 백슬래시를 이스케이프한다', () => {
    expect(escapeGraphQLString('a"b')).toBe('a\\"b');
    expect(escapeGraphQLString('a\\b')).toBe('a\\\\b');
  });

  it('개행과 탭은 이스케이프하고 CR은 버린다', () => {
    expect(escapeGraphQLString('a\nb')).toBe('a\\nb');
    expect(escapeGraphQLString('a\tb')).toBe('a\\tb');
    expect(escapeGraphQLString('a\rb')).toBe('ab');
  });

  it('한글 등 평범한 문자는 건드리지 않는다', () => {
    expect(escapeGraphQLString('도커의 시작')).toBe('도커의 시작');
  });

  it('필터 주입 시도가 리터럴 안에 갇힌다', () => {
    // 이 페이로드는 수정 전이라면 필터 객체를 닫고 다른 조건을 주입했다
    const attack = '" } }, { status: { _eq: "draft';
    const literal = gqlString(attack);

    expect(literal.startsWith('"')).toBe(true);
    expect(literal.endsWith('"')).toBe(true);
    // 바깥 따옴표 2개를 뺀 내부에는 이스케이프되지 않은 따옴표가 없어야 한다
    expect(literal.slice(1, -1).match(/(?<!\\)"/)).toBeNull();
  });

  it('gqlStringList는 각 항목을 개별 이스케이프한다', () => {
    expect(gqlStringList(['a', 'b"c'])).toBe('["a", "b\\"c"]');
    expect(gqlStringList([])).toBe('[]');
  });
});

describe('resolveSearchType', () => {
  it.each([
    [{}, null],
    [{ search: 'docker' }, 'search'],
    [{ category: 'framework' }, 'category'],
    [{ tag: 'react' }, 'tag'],
    [{ series: 'iaas' }, 'series'],
    // 둘 이상이 겹치면 일반 검색으로 떨어진다
    [{ category: 'framework', tag: 'react' }, 'search'],
    // search가 있으면 다른 조건보다 우선한다
    [{ search: 'docker', category: 'framework' }, 'search'],
  ])('%o -> %s', (input, expected) => {
    expect(resolveSearchType(input)).toBe(expected);
  });
});

describe('calculatePostCount', () => {
  it('부모의 자기 글 수에 자식 합계를 더한다', () => {
    const result = calculatePostCount({
      id: 'p',
      parentId: null,
      name: 'Parent',
      slug: 'parent',
      icon: null,
      postCount: 3,
      children: [
        { id: 'c1', parentId: 'p', name: 'C1', slug: 'c1', icon: null, postCount: 2 },
        { id: 'c2', parentId: 'p', name: 'C2', slug: 'c2', icon: null, postCount: 5 },
      ],
    });

    // 대입이 아니라 합산이어야 한다 — 대입하면 부모의 3이 사라진다
    expect(result.postCount).toBe(10);
  });

  it('자식이 없으면 자기 수를 그대로 둔다', () => {
    const result = calculatePostCount({
      id: 'a',
      parentId: null,
      name: 'A',
      slug: 'a',
      icon: null,
      postCount: 4,
    });
    expect(result.postCount).toBe(4);
    expect(result.children).toBeUndefined();
  });

  it('손자까지 재귀적으로 합산한다', () => {
    const result = calculatePostCount({
      id: 'root',
      parentId: null,
      name: 'Root',
      slug: 'root',
      icon: null,
      postCount: 1,
      children: [
        {
          id: 'mid',
          parentId: 'root',
          name: 'Mid',
          slug: 'mid',
          icon: null,
          postCount: 2,
          children: [
            { id: 'leaf', parentId: 'mid', name: 'Leaf', slug: 'leaf', icon: null, postCount: 4 },
          ],
        },
      ],
    });
    expect(result.postCount).toBe(7);
  });
});

describe('buildTree', () => {
  it('parentId로 계층을 만든다', () => {
    const tree = buildTree([
      { id: 'a', parentId: null },
      { id: 'b', parentId: 'a' },
      { id: 'c', parentId: 'b' },
      { id: 'd', parentId: null },
    ]);

    expect(tree.map((n) => n.id)).toEqual(['a', 'd']);
    expect(tree[0]?.children?.[0]?.id).toBe('b');
    expect(tree[0]?.children?.[0]?.children?.[0]?.id).toBe('c');
  });

  it('부모가 없는 항목은 트리에서 빠진다', () => {
    const tree = buildTree([{ id: 'orphan', parentId: 'missing' }]);
    expect(tree).toEqual([]);
  });
});

describe('decodeRouteSlug / normalizeRoutePath', () => {
  it('단일·이중 인코딩을 모두 원래 값으로 되돌린다', () => {
    const raw = '도커의-시작';
    expect(decodeRouteSlug(encodeURIComponent(raw))).toBe(raw);
    expect(decodeRouteSlug(encodeURIComponent(encodeURIComponent(raw)))).toBe(raw);
    expect(decodeRouteSlug(raw)).toBe(raw);
  });

  it('깨진 퍼센트 인코딩에도 던지지 않는다', () => {
    expect(decodeRouteSlug('%E0%A4%A')).toBe('%E0%A4%A');
  });

  it('경로 비교 시 인코딩 차이와 끝 슬래시를 흡수한다', () => {
    const a = normalizeRoutePath(
      '/posts/49-cloud-infra-%EB%8F%84%EC%BB%A4%EC%9D%98-%EC%8B%9C%EC%9E%91',
    );
    const b = normalizeRoutePath('/posts/49-cloud-infra-도커의-시작/');
    expect(a).toBe(b);
  });
});

describe('readingMinutes', () => {
  it('본문이 없으면 0', () => {
    expect(readingMinutes(null)).toBe(0);
    expect(readingMinutes('')).toBe(0);
  });

  it('짧은 글도 최소 1분', () => {
    expect(readingMinutes('안녕하세요')).toBe(1);
  });

  it('한글 500자를 1분으로 센다', () => {
    expect(readingMinutes('가'.repeat(1000))).toBe(2);
  });

  it('코드 펜스는 분량에서 제외한다', () => {
    const withCode = '가'.repeat(500) + '\n```\n' + 'x '.repeat(5000) + '\n```\n';
    expect(readingMinutes(withCode)).toBe(1);
  });
});

describe('날짜 포맷 (KST 고정)', () => {
  it('오프셋 없는 문자열을 KST로 해석한다', () => {
    // 2026-08-27T01:02:17 KST = 2026-08-26T16:02:17Z
    expect(parsePostDate('2026-08-27T01:02:17')?.toISOString()).toBe('2026-08-26T16:02:17.000Z');
  });

  it('오프셋이 이미 있으면 그대로 존중한다', () => {
    expect(parsePostDate('2026-08-27T01:02:17Z')?.toISOString()).toBe('2026-08-27T01:02:17.000Z');
  });

  it('실행 환경 타임존과 무관하게 같은 날짜를 낸다', () => {
    // 이 값이 환경에 따라 8/26과 8/27로 갈리던 것이 원래 버그였다
    expect(formatPostDateYmd('2026-08-27T01:02:17')).toBe('2026-08-27');
    expect(formatPostDateLong('2026-08-27T01:02:17')).toBe('Thursday, 27 August 2026');
  });

  it('자정 직후에도 날짜가 밀리지 않는다', () => {
    expect(formatPostDateYmd('2026-08-27T00:00:00')).toBe('2026-08-27');
  });

  it('잘못된 값은 빈 문자열', () => {
    expect(formatPostDateYmd('not-a-date')).toBe('');
    expect(formatPostDateYmd(null)).toBe('');
  });
});
