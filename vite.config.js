import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('react-globe.gl') || id.includes('three')) {
            return 'vendor-globe';
          }

          if (id.includes('leaflet') || id.includes('react-leaflet')) {
            return 'vendor-map';
          }

          if (id.includes('react-router')) {
            return 'vendor-router';
          }
        },
      },
    },
  },
});
