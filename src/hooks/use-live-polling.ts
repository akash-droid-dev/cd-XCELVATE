import { useEffect, useRef } from 'react';
import { fetchEventRows, fetchMetrics } from '../lib/api-client';
import { mapApiPayload } from '../lib/api-adapter';
import { useLiveStore } from '../store/live-store';

const POLL_MS = 5000;
const STALE_AFTER_MS = 15000;

export const useLivePolling = (): void => {
  const upsertBatch = useLiveStore((s) => s.upsertBatch);
  const setStatus = useLiveStore((s) => s.setStatus);
  const setError = useLiveStore((s) => s.setError);
  const markStale = useLiveStore((s) => s.markStale);
  const markAttempt = useLiveStore((s) => s.markAttempt);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const tick = async () => {
      try {
        markAttempt();
        setStatus('loading');

        const [rowsRaw, metricsRaw] = await Promise.all([
          fetchEventRows<unknown>(),
          fetchMetrics<unknown>(),
        ]);

        if (!mounted.current) return;

        const mappedRows = mapApiPayload(rowsRaw);
        const mappedMetrics = metricsRaw ? mapApiPayload(metricsRaw) : null;

        upsertBatch(
          mappedRows.participants,
          mappedMetrics?.aggregateAmount ?? mappedRows.aggregateAmount,
          mappedMetrics?.aggregateParticipants ?? mappedRows.aggregateParticipants,
        );
      } catch (error) {
        if (!mounted.current) return;
        setError(error instanceof Error ? error.message : 'Unknown API error');
        const now = Date.now();
        const lastSuccessAt = useLiveStore.getState().lastSuccessAt;
        if (!lastSuccessAt || now - lastSuccessAt > STALE_AFTER_MS) {
          markStale(true);
        }
      }
    };

    void tick();
    const interval = setInterval(() => {
      void tick();
    }, POLL_MS);

    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [markAttempt, markStale, setError, setStatus, upsertBatch]);
};
