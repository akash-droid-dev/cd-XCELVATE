import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useParticipants } from '../../store/live-store';

type Props = { displayMode: boolean };

const FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23121b2b"/><circle cx="200" cy="120" r="52" fill="%23cbd5e1"/><rect x="115" y="188" width="170" height="76" rx="38" fill="%23cbd5e1"/></svg>';

export const LivePhotoCollageSection = ({ displayMode }: Props) => {
  const participants = useParticipants();
  const photos = useMemo(() => participants.filter((p) => p.photoUrl).map((p) => p.photoUrl as string), [participants]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setOffset((prev) => prev + 1), 3000);
    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    const nextStart = (offset + 12) % (photos.length || 1);
    const prefetch = Array.from({ length: Math.min(8, photos.length) }).map((_, i) => photos[(nextStart + i) % photos.length]);
    prefetch.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [offset, photos]);

  const visible = useMemo(() => {
    if (!photos.length) return [] as string[];
    const size = 12;
    const start = offset % photos.length;
    return Array.from({ length: Math.min(size, photos.length) }).map((_, i) => photos[(start + i) % photos.length]);
  }, [offset, photos]);

  return (
    <section className="px-8 py-16">
      <h2 className="serif mb-8 text-center text-4xl text-slate-100">Live Photo Collage</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((src, index) => (
            <motion.img
              key={`${src}-${index}-${offset}`}
              src={src}
              alt="Participant"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK;
              }}
              className={`h-40 w-full rounded-xl object-cover ${displayMode ? 'md:h-56' : 'md:h-44'}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
