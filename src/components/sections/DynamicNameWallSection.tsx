import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useParticipants } from '../../store/live-store';

type Props = { displayMode: boolean };

export const DynamicNameWallSection = ({ displayMode }: Props) => {
  const participants = useParticipants();
  const items = useMemo(() => participants.slice(0, 120), [participants]);

  return (
    <section className="px-8 py-16">
      <h2 className="serif mb-8 text-center text-4xl text-slate-100">Dynamic Name Wall</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item, index) => (
          <motion.div
            key={item.dedupeKey}
            className="glass-card bg-slate-900/50 p-3 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{ y: [0, index % 2 === 0 ? -7 : 7, 0] }}
            transition={{ duration: 2 + (index % 5) * 0.35, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className={`font-medium text-slate-100 ${displayMode ? 'text-2xl' : 'text-sm md:text-base'}`}>{item.fullName}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
