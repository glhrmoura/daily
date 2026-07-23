import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: false,
      routesDirectory: './src/pages',
      generatedRouteTree: './src/routes/route-tree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
});
