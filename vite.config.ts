import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import sass from 'sass';
import path from 'path';
import dts from 'vite-plugin-dts';

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const isLibraryBuild = process.env.VITE_BUILD_TYPE === 'library';

  return defineConfig({
    base: `/${process.env.VITE_BASE_PATH}`,
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sass,
          quietDeps: true,
          warnRuleAsWarning: false,
        },
      },
    },
    build: isLibraryBuild
      ? {
          lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'email-scribe',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'umd'],
          },
          rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          },
          emptyOutDir: true,
          sourcemap: true,
        }
      : {
          outDir: 'dist-static',
          emptyOutDir: true,
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
    plugins: [
      react(),
      dts({ tsconfigPath: './tsconfig.app.json', rollupTypes: true }),
    ],
  });
};
