import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const baseUrl = mode === 'production' 
    ? 'https://michaelmov.github.io/ascii-tetris'
    : 'http://localhost:5173';

  return {
    root: 'src',
    base: './',
    plugins: [
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html
            .replace(/%BASE_URL%/g, baseUrl + '/')
            .replace(/%IMAGE_URL%/g, `${baseUrl}/images/ascii-tetris-min.png`);
        },
      },
    ],
    build: {
      outDir: '../dist',
      assetsDir: '',
      emptyOutDir: true,
      sourcemap: true,
    },
    resolve: {
      extensions: ['.ts', '.js', '.css'],
    },
    css: {
      devSourcemap: true,
    },
  };
});
