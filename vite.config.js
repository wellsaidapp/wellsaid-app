import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  build: {
    assetsInclude: ['**/*.worker.js']
  },
  server: {
    host: true, // Allow external connections
    allowedHosts: [
      '9082aaed0f68.ngrok-free.app' // 👈 Replace with your actual ngrok hostname
    ]
  }
});
