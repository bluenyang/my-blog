import { parseMarkdown } from '@comark/nuxt/parse';
import type { MarkdownDocument } from 'comark';

import directusImages from './comark-directus-images';

export async function parseContent(content: string): Promise<MarkdownDocument> {
  const config = useRuntimeConfig();

  return parseMarkdown(content, {
    // 본문 이미지 변환은 런타임 설정(directusUrl)이 필요해 여기서 합성한다
    plugins: [...comarkPlugins, directusImages(config.public.directusUrl)],
  });
}
