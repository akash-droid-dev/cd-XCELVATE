import { animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { formatINR } from '../../lib/utils';
import { useTotals } from '../../store/live-store';

type Props = { displayMode: boolean };

export const LiveMetricsSection = ({ displayMode }: Props) => {
  const { totalAmount, totalParticipants } = useTotals();
  const [displayAmount, setDisplayAmount] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    const controls = animate(previous.current, totalAmount, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayAmount(Math.round(latest)),
    });
    previous.current = totalAmount;
    return () => controls.stop();
  }, [totalAmount]);

  return (
    <section className="px-8 py-20">
      <h2 className="serif mb-8 text-center text-4xl text-slate-100">Live Metrics</h2>
      <div className="glass-card mx-auto max-w-5xl border-white/35 bg-gradient-to-br from-slate-100/20 to-slate-300/5 p-8 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-300">Total Pledge Commitment Amount</p>
        <p className={`serif font-semibold text-white ${displayMode ? 'text-7xl' : 'text-5xl md:text-6xl'}`}>{formatINR(displayAmount)}</p>
        <p className={`mt-6 text-slate-300 ${displayMode ? 'text-2xl' : 'text-lg'}`}>Participants: {totalParticipants}</p>
      </div>
    </section>
  );
};
