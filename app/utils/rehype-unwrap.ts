import type { Element, ElementContent, Root } from 'hast';

function isWhitespaceText(node: ElementContent): boolean {
  return node.type === 'text' && node.value.trim() === '';
}

function unwrapSingleImageParagraphs(node: Root | Element) {
  if (!('children' in node) || !node.children) return;

  const children = node.children as ElementContent[];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (!child) {
      continue;
    }
    if (child.type !== 'element') {
      continue;
    }

    const meaningfulChildren = (child.children || []).filter((c) => !isWhitespaceText(c));

    // <p> 안에 <img> 하나만 있는 경우 → p를 벗기고 img로 교체
    if (
      child.tagName === 'p' &&
      meaningfulChildren.length === 1 &&
      meaningfulChildren[0]!.type === 'element' &&
      meaningfulChildren[0]!.tagName === 'img'
    ) {
      children.splice(i, 1, meaningfulChildren[0] as Element);
      continue; // 교체된 노드는 img라 재귀 진입 불필요
    }

    unwrapSingleImageParagraphs(child);
  }
}

export function rehypeUnwrapImages() {
  return (tree: Root) => {
    unwrapSingleImageParagraphs(tree);
  };
}
