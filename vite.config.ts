import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Auto-detect GitHub Pages repo path in CI if VITE_BASE_PATH is not explicitly set.
  // GITHUB_REPOSITORY looks like: owner/repo
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const inferredGhPagesBase = process.env.GITHUB_ACTIONS === 'true' && repoName ? `/${repoName}/` : undefined;

  const base = env.VITE_BASE_PATH || inferredGhPagesBase || '/';

  return {
    base,
    plugins: [react()],
  };
});
