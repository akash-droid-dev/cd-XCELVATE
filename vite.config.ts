import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  /**
   * Important for GitHub Pages project sites:
   * - For https://<user>.github.io/<repo>/ use VITE_BASE_PATH=/<repo>/
   * - For custom domain/root hosting keep '/'
   */
  // Use relative base by default so GitHub Pages project paths do not blank if env is unset.
  const base = env.VITE_BASE_PATH || './';

  return {
    base,
    plugins: [react()],
  };
});
