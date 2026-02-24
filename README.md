# Xcelevate Skills Foundation – Live Funding Event Display

Production-focused one-page cinematic display site for projector/laptop event screens.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Framer Motion (+ GSAP installed for optional advanced loops)
- Zustand

## Setup
1. Copy environment:
   ```bash
   cp .env.example .env
   ```
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## API mapping guide
All backend field mapping is isolated in:
- `src/lib/api-adapter.ts`

Default assumed row schema:
```ts
{
  id?: string;
  fullName: string;
  photoUrl?: string;
  pledgeAmount?: number;
  timestamp?: string;
}
```

### Supported payload shapes
- `[]`
- `{ rows: [] }`
- `{ data: [] }`
- `{ participants: [] }`

Optional aggregate fields supported:
- `aggregateAmount` or `totalPledgeAmount`
- `aggregateParticipants` or `totalParticipants`

## Runtime behavior
- Poll every 5 seconds.
- Timeout + retry with exponential backoff.
- Incremental merge updates in Zustand store (no full re-render reset).
- Deduplication priority: `id` → `timestamp` → `name+photo` hash.
- Keep last good data during API errors.
- Show subtle stale indicator if feed delay exceeds threshold.
- Photo collage rotates every 3 seconds.
- Google Drive links are converted to direct image URLs.
- INR formatting uses Indian locale grouping.


## GitHub Pages blank-screen fix
If the site opens blank on GitHub Pages, set the correct Vite base path in `.env` before building:

```bash
VITE_BASE_PATH=/<your-repo-name>/
```

Examples:
- Project page: `https://username.github.io/my-repo/` -> `VITE_BASE_PATH=/my-repo/`
- User/org root page or custom domain -> `VITE_BASE_PATH=./`

Then rebuild/redeploy:
```bash
npm run build
```

## Display-only mode
Open with:
```text
?mode=display
```
Effects:
- hidden cursor
- larger text
- projector-friendly visual scale

## Event-day checklist
- Validate API URLs and CORS before event start.
- Open in fullscreen browser (F11 / kiosk mode).
- Use `?mode=display` on projector machine.
- Ensure stable internet backup.
- Keep one operator tab open to monitor API health.


### If still blank after deploy
Check browser DevTools on the deployed page:
1. **Network tab**: if JS/CSS files are 404, your `base` is wrong for the publish URL.
2. **Console tab**: if API/CORS errors appear, UI should still render sections; hard refresh once after redeploy to clear stale service-worker/cache.
3. Verify GitHub Pages source is the latest branch/build artifact and not an older branch snapshot.


## GitHub Pages deployment (recommended)
1. Commit and push this repo to GitHub.
2. In GitHub repo settings, set **Pages source** to **GitHub Actions**.
3. Add repository variables:
   - `VITE_API_BASE_URL`
   - `VITE_API_ROWS_ENDPOINT`
   - `VITE_API_METRICS_ENDPOINT`
4. Push to `main` (or `work`) to trigger `.github/workflows/deploy-pages.yml`.

This workflow auto-detects `/<repo>/` base path in GitHub Actions (using `GITHUB_REPOSITORY`) if `VITE_BASE_PATH` is not set, which prevents blank deployments caused by wrong asset paths.
