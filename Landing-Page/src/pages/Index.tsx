import { useState, useEffect } from 'react';
import { usePrayerBackground } from '@/hooks/usePrayerBackground';

const Index = () => {
  usePrayerBackground();

  const [downloadCount, setDownloadCount] = useState(0);

  // Simulated download count - replace with real API when backend is connected
  useEffect(() => {
    const baseCount = 1247;
    const daysSinceLaunch = Math.floor(
      (Date.now() - new Date('2025-01-01').getTime()) / (1000 * 60 * 60 * 24)
    );
    setDownloadCount(baseCount + daysSinceLaunch * 3);
  }, []);

  return (
    <>
      <div className="pattern-overlay" />
      <div className="golden-border">
        <div className="flex flex-col items-center justify-center text-center z-10 px-8 max-w-2xl">
          {/* App Name */}
          <h1 className="font-display text-5xl md:text-7xl tracking-widest text-foreground mb-8">
            Adhkar Daily
          </h1>

          {/* Subtitle */}
          <p className="font-body text-lg md:text-xl text-foreground/80 leading-relaxed mb-4 max-w-lg">
            A sacred space for duʿāʾ, reflection, and daily affirmations to nurture your soul.
          </p>

          {/* Powered by */}
          <p className="font-body text-sm text-gold tracking-wide mb-3">
            Your companion for spiritual growth.
          </p>

          {/* Secondary text */}
          <p className="font-body text-sm text-muted-foreground mb-10 max-w-md">
            Helping You to Transform Your Heart Through Daily Remembrance.
          </p>

          {/* Download Button */}
          <a
            href="#"
            className="inline-block border-2 border-gold bg-gold/10 hover:bg-gold/20 text-gold font-display text-sm tracking-[0.25em] uppercase px-12 py-4 transition-all duration-300 mb-6"
          >
            Download App
          </a>

          {/* Availability */}
          <div className="flex flex-col items-center gap-2 mb-10">
            <span className="font-body text-xs text-muted-foreground tracking-wider uppercase">
              Available only on desktop
            </span>
          </div>

          {/* Download Counter */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot" />
            <span className="font-body text-sm text-foreground/70">
              {downloadCount.toLocaleString()} downloads
            </span>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground font-body">
            Offline app · No data collected · No user information stored
          </p>
        </div>
      </div>
    </>
  );
};

export default Index;