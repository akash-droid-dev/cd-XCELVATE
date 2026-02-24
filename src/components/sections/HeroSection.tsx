import { motion } from 'framer-motion';

type Props = { displayMode: boolean };

export const HeroSection = ({ displayMode }: Props) => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-8">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,153,51,0.25),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(0,48,135,0.35),_transparent_35%)]" />
    <motion.h1
      className={`serif relative z-10 text-center font-semibold tracking-wide text-white ${displayMode ? 'text-6xl' : 'text-5xl md:text-7xl'}`}
      initial={{ opacity: 0, y: 50, letterSpacing: '0.6em' }}
      whileInView={{ opacity: 1, y: 0, letterSpacing: '0.06em' }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      Xcelevate Skills Foundation
    </motion.h1>
  </section>
);
