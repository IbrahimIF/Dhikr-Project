import { useState, useEffect } from "react";
import { usePrayerBackground, prayerColors } from "@/hooks/usePrayerBackground";

const Index = () => {
  const { activePrayer } = usePrayerBackground();

  const [downloadCount, setDownloadCount] = useState(0);
  const [showDownload, setShowDownload] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/downloads.json");
        const data = await res.json();
        setDownloadCount(data.count);
      } catch (err) {
        console.error("Download counter failed", err);
      }
    };

    fetchCount();
  }, []);

  const download = async (platform: string) => {
    try {
      await fetch("/api/increment-download", { method: "POST" });
      setDownloadCount(prev => prev + 1);

      const files: Record<string, string> = {
        windows: "/downloads/adhkar-daily-windows.zip",
        mac: "/downloads/adhkar-daily-mac.zip",
        linux: "/downloads/adhkar-daily-linux.AppImage"
      };

      window.location.href = files[platform];
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="pattern-overlay" />

      <div className="golden-border">
        <div className="flex flex-col items-center text-center px-8 max-w-2xl">

          <h1 className="font-display text-6xl md:text-7xl tracking-widest mb-8">
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
            className="border-2 border-gold bg-gold/20 hover:bg-gold/30 text-gold tracking-[0.25em] uppercase px-12 py-4 transition-all mb-6"
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
              href="https://buy.stripe.com/test_28E8wR86Japc8Vff2Z8og00"
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
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">

        <div className="pattern-overlay" />

        <div
          className="relative border border-gold px-12 py-14 text-center max-w-md w-full shadow-xl"
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
              onClick={() => download("linux")}
              className="border border-gold px-6 py-3 hover:bg-gold/20 transition-all"
            >
              Linux
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
            src="https://www.youtube.com/embed/VIDEO_ID"
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