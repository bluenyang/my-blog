// import type { MDCParserResult } from '@nuxtjs/mdc';

import { parse } from '@comark/nuxt/parse';
import toc from 'comark/plugins/toc';
import highlight from '@comark/nuxt/plugins/highlight';
import oneDarkPro from '@shikijs/themes/one-dark-pro';
import type { ComarkTree } from 'comark';

export async function parseContent(content: string): Promise<ComarkTree> {
  return parse(content, {
    plugins: [toc(), highlight({ themes: { light: oneDarkPro, dark: oneDarkPro } })],
    // rehype: {
    //   plugins: {
    //     unwrapImages: {
    //       instance: rehypeUnwrapImages,
    //     },
    //   },
    // },
  });
}
