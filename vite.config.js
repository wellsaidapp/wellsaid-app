import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  },
  optimizeDeps: {
    include: ['pdfjs-dist', 'aws-amplify'] // Add aws-amplify here
  },
  build: {
    assetsInclude: ['**/*.worker.js'],
    rollupOptions: {
      external: ['aws-amplify'], // Add this line
      output: {
        manualChunks: {
          'aws-amplify': ['aws-amplify'] // Optional: creates separate chunk
        }
      }
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
      './runtimeConfig': './runtimeConfig.browser' // Important for Amplify
    }
  }
});
