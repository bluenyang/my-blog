import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/scripts/common.ts',
  output: {
    dir: 'dist/images',
    format: 'iife',
    sourcemap: false,
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser({
      mangle: {
        toplevel: true,
      },
      compress: {
        drop_console: true,
      }
    })
  ],
}