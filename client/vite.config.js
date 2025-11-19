// client/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- ADD THE SERVER CONFIGURATION HERE ---
  server: {
    // This tells Vite to proxy requests starting with /api
    // to your Express backend running on port 5000.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false, // Set to true if using https, false for http
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Optional: Keep the /api prefix
      },
    },
  },
  // --- END SERVER CONFIGURATION ---
});