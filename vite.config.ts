import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/bounce-blaster/', // GitHub Pages デプロイ用のパス設定
  define: {
    __DEV__: JSON.stringify(mode === 'development'),
  },
}));
