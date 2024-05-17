import { defineConfig } from 'vite';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
    },
    define: {
      'process.env': {
        BACKEND_URL: env.BACKEND_URL || 'localhost:3000',
      },
    },
    plugins: [vue()],
  };
});
