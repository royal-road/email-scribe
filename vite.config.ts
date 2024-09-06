import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import sass from 'sass';
import path from 'path';

// @ts-ignore
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: `/${process.env.VITE_BASE_PATH}`,
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sass,
          quietDeps: true,
          warnRuleAsWarning: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@lib': path.resolve(__dirname, './lib'),
        '@api': path.resolve(__dirname, './api'),
      },
    },
  });
};
