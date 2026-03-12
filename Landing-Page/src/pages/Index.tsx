import { useState, useEffect } from "react";
import { usePrayerBackground, prayerColors } from "@/hooks/usePrayerBackground";

const Index = () => {
  const { activePrayer } = usePrayerBackground();

  const [downloadCount, setDownloadCount] = useState(0);
  const [showDownload, setShowDownload] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseHeaders = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json"
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/downloads?select=count&id=eq.1`, {
          headers: supabaseHeaders
        });
        const data = await res.json();
        if (data?.[0]?.count !== undefined) setDownloadCount(data[0].count);
      } catch (err) {
        console.error("Download counter failed", err);
      }
    };

    fetchCount();
  }, []);

  const download = (platform: string) => {
    const files: Record<string, string> = {
      windows: import.meta.env.VITE_DOWNLOAD_WINDOWS,
      mac: import.meta.env.VITE_DOWNLOAD_MAC,
      linux: import.meta.env.VITE_DOWNLOAD_LINUX
    };

    window.location.href = files[platform];

    // Best-effort counter increment via Supabase RPC
    fetch(`${supabaseUrl}/rest/v1/rpc/increment_downloads`, {
      method: "POST",
      headers: supabaseHeaders,
      body: "{}"
    })
      .then(() => setDownloadCount(prev => prev + 1))
      .catch(() => {});
  };

  return (
    <>
      <div className="pattern-overlay" />

      <div className="golden-border">
        <div className="flex flex-col items-center text-center px-4 sm:px-8 max-w-2xl">

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-widest mb-8">
            Adhkar Daily
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 mb-4 max-w-lg">
            A sacred space for duʿāʾ, reflection, and daily remembrance.
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            Available only on desktop
          </p>

          {/* Download Button */}

          <button
            onClick={() => setShowDownload(true)}
            className="border-2 border-gold bg-gold/20 hover:bg-gold/30 text-gold tracking-[0.25em] uppercase px-8 sm:px-12 py-4 transition-all mb-6"
          >
            Download App
          </button>

          {/* Secondary Buttons */}

          <div className="flex gap-6 mb-10">

            <button
              onClick={() => setShowPreview(true)}
              className="text-sm text-gold underline"
            >
              Watch Preview
            </button>

            <a
              href="https://buy.stripe.com/4gM4gAg6Df6Feqy45hdEs01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gold underline"
            >
              Support
            </a>

            <a
              href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}
              className="text-sm text-gold underline"
            >
              Contact
            </a>

          </div>

          {/* Download Counter */}

          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot" />
            <span className="text-sm">
              {downloadCount.toLocaleString()} downloads
            </span>
            <button
              onClick={() => setDownloadCount(0)}
              className="text-xs text-muted-foreground opacity-40 hover:opacity-80 leading-none"
              title="Reset counter"
            >
              ×
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Offline app · No data collected · No user information stored
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            Version 1.0
          </p>

        </div>
      </div>

      {/* DOWNLOAD OVERLAY */}
      {showDownload && (
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">

        <div className="pattern-overlay" />

        <div
          className="relative border border-gold px-6 py-10 sm:px-12 sm:py-14 text-center max-w-md w-full shadow-xl"
          style={{ backgroundColor: activePrayer ? prayerColors[activePrayer] : '#111822' }}
        >

          <h2 className="font-display text-2xl tracking-wider mb-8">
            Choose your platform
          </h2>

          <div className="flex flex-col gap-4">

            <button
              onClick={() => download("windows")}
              className="border border-gold px-6 py-3 hover:bg-gold/20 transition-all"
            >
              Windows (portable zip)
            </button>

            <button
              disabled
              className="border border-muted px-6 py-3 text-muted-foreground cursor-not-allowed"
            >
              macOS (coming soon)
            </button>

            <button
              disabled
              className="border border-muted px-6 py-3 text-muted-foreground cursor-not-allowed"
            >
              Linux (coming soon)
            </button>

          </div>

          <button
            onClick={() => setShowDownload(false)}
            className="mt-8 text-sm text-muted-foreground underline"
          >
            Cancel
          </button>

        </div>

      </div>
      )}

      {/* PREVIEW OVERLAY */}

      {showPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <iframe
            src="https://www.youtube.com/watch?v=LFO4TMdhdkU"
            className="w-11/12 h-3/4"
            allowFullScreen
          />

          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-6 text-white text-3xl"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default Index;