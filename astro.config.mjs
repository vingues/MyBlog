import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://vingues.github.io',
  base: '/MyBlog',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
