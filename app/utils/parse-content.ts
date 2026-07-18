import type { MDCParserResult } from '@nuxtjs/mdc';

export async function parseContent(content: string): Promise<MDCParserResult> {
  const ast = await parseMarkdown(content, {
    rehype: {
      plugins: {
        unwrapImages: {
          instance: rehypeUnwrapImages,
        },
      },
    },
  });
  return ast;
}
