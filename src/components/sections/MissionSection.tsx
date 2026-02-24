import { motion } from 'framer-motion';

type Props = { displayMode: boolean };

export const MissionSection = ({ displayMode }: Props) => (
  <section className="relative flex min-h-[80vh] items-center justify-center px-8 py-20">
    <motion.p
      className={`serif max-w-5xl text-center leading-tight text-slate-100 ${displayMode ? 'text-4xl' : 'text-3xl md:text-5xl'}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.5 }}
    >
      Elevate Excellence of the Underprivileged, Empowering Them to Achieve a Fulfilling Career
    </motion.p>
  </section>
);
