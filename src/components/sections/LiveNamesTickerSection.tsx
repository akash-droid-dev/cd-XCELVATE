import { useMemo } from 'react';
import { useParticipants } from '../../store/live-store';

type Props = { displayMode: boolean };

export const LiveNamesTickerSection = ({ displayMode }: Props) => {
  const participants = useParticipants();
  const names = useMemo(() => participants.map((p) => p.fullName), [participants]);
  const repeated = [...names, ...names];

  return (
    <section className="bg-black px-6 py-8">
      <div className="glass-card overflow-hidden border-emerald-300/30 bg-gradient-to-r from-black via-zinc-900 to-black py-4">
        <div className="ticker-track flex min-w-max items-center gap-8 px-6">
          {repeated.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className={`whitespace-nowrap font-semibold tracking-wide text-emerald-200 ${displayMode ? 'text-3xl' : 'text-xl md:text-2xl'}`}
            >
              {name}
              <span className="mx-4 text-slate-400">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
