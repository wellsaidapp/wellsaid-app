import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  },
  optimizeDeps: {
    include: ['pdfjs-dist', '@aws-amplify/core', '@aws-amplify/auth']
  },
  build: {
    assetsInclude: ['**/*.worker.js'],
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  server: {
    host: true,
    allowedHosts: [
      '9082aaed0f68.ngrok-free.app'
    ]
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser'
    }
  }
});
