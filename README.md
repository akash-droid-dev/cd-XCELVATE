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
