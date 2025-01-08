import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  root: './Portfolio', 

  build: {
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: './Portfolio/index.html', 
    },
    outDir: 'dist', 
  }
});
