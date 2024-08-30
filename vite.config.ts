import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import sass from 'sass';
// https://vitejs.dev/config/

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
  });
};

// export default defineConfig({
//   mode: process.env.NODE_ENV,
//   base: `/${import.meta.env.VITE_BASE_PATH}`,
//   plugins: [react()],
// css: {
//   preprocessorOptions: {
//     scss: {
//       implementation: sass,
//       quietDeps: true,
//       warnRuleAsWarning: false,
//     },
//   },
// },
// });
