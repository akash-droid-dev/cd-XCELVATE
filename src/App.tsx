import { useMemo } from 'react';
import { DynamicNameWallSection } from './components/sections/DynamicNameWallSection';
import { FooterSection } from './components/sections/FooterSection';
import { HeroSection } from './components/sections/HeroSection';
import { LiveMetricsSection } from './components/sections/LiveMetricsSection';
import { LiveNamesTickerSection } from './components/sections/LiveNamesTickerSection';
import { LivePhotoCollageSection } from './components/sections/LivePhotoCollageSection';
import { MissionSection } from './components/sections/MissionSection';
import { StaleIndicator } from './components/ui/StaleIndicator';
import { useLivePolling } from './hooks/use-live-polling';

const App = () => {
  useLivePolling();

  const displayMode = useMemo(() => new URLSearchParams(window.location.search).get('mode') === 'display', []);

  return (
    <div className={displayMode ? 'display-mode' : ''}>
      <StaleIndicator />
      <main className="bg-gradient-to-b from-[#003087] via-slate-900 to-[#0a0f1d]">
        <HeroSection displayMode={displayMode} />
        <MissionSection displayMode={displayMode} />
        <LiveNamesTickerSection displayMode={displayMode} />
        <DynamicNameWallSection displayMode={displayMode} />
        <LivePhotoCollageSection displayMode={displayMode} />
        <LiveMetricsSection displayMode={displayMode} />
      </main>
      <FooterSection />
    </div>
  );
};

export default App;
