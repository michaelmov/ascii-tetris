import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});
