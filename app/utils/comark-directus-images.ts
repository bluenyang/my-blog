import { defineComarkPlugin } from 'comark';
import type { ElementNode, Node } from 'comark';
import { visit } from 'comark/utils';

function isImage(node: Node): node is ElementNode {
  return Array.isArray(node) && node[0] === 'img';
}

/**
 * 본문 마크다운의 Directus 이미지에 transform 파라미터를 붙인다.
 *
 * 목록 썸네일·커버는 매퍼가 변환 URL을 만들지만, 본문 이미지는 마크다운에 asset URL이
 * 그대로 박혀 있어 매퍼를 거치지 않는다. 그 결과 원본이 통째로 나간다
 * (실측: 한 글에서 254KB -> 62KB, 76% 감소).
 *
 * 렌더 컴포넌트가 아니라 플러그인 계층에서 처리하는 이유는, 본문 img가
 * ProseImg를 거치지 않고 소자 <img>로 렌더되기 때문이다.
 */
export default defineComarkPlugin<string | undefined>((assetBaseUrl) => ({
  name: 'directus-images',
  post(state) {
    if (!assetBaseUrl) return;
    const prefix = `${assetBaseUrl}/assets/`;

    // visit은 방문자의 반환값으로 노드를 교체한다. 제자리 변형은 반영되지 않으므로
    // 새 노드를 만들어 돌려준다 (unwrap-images 플러그인과 같은 방식).
    visit(state.tree, isImage, (node) => {
      const props = (node[1] ?? {}) as Record<string, unknown>;
      const src = props.src;
      if (typeof src !== 'string' || !src.startsWith(prefix)) return;

      return [
        'img',
        {
          ...props,
          // 작성자가 직접 쿼리를 붙였으면 존중한다
          src: src.includes('?') ? src : `${src}?width=1280&format=webp&quality=80`,
          loading: props.loading ?? 'lazy',
          decoding: props.decoding ?? 'async',
        },
        ...node.slice(2),
      ] as ElementNode;
    });
  },
}));
