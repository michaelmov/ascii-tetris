import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.css'],
  },
  css: {
    devSourcemap: true,
  },
});
