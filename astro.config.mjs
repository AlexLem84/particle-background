// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'three': ['three'],
            'gsap': ['gsap']
          }
        }
      }
    }
  }
});
