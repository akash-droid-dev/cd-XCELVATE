import { useLiveStore } from '../../store/live-store';

export const StaleIndicator = () => {
  const stale = useLiveStore((s) => s.stale);
  const lastSuccessAt = useLiveStore((s) => s.lastSuccessAt);

  if (!stale) return null;

  return (
    <div className="fixed right-4 top-4 z-50 rounded-full border border-amber-300/40 bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-100 backdrop-blur">
      Live feed delayed • Last good sync {lastSuccessAt ? new Date(lastSuccessAt).toLocaleTimeString() : 'N/A'}
    </div>
  );
};
