import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);

  useEffect(() => {
    // Check if app is already running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also show install button on mobile/desktop browsers if not dismissed
    const dismissed = sessionStorage.getItem('hadi88_pwa_dismissed');
    if (!dismissed && !isStandalone) {
      setShowBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Browser doesn't support automatic prompt (e.g. iOS Safari, or iframe)
      setShowHowToModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem('hadi88_pwa_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      {/* Floating or Top PWA Promotion Banner */}
      <aside aria-label="Install Hadi88 Apps PWA" className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black px-3 py-2 sm:py-2.5 shadow-lg border-b border-amber-400/40 relative z-40 animate-fade-in">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-display font-black text-sm shrink-0 shadow-sm">
              H
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold font-display leading-tight truncate">
                Install Hadi88 Apps on Your Device
              </p>
              <p className="text-[10px] sm:text-xs text-stone-900 font-medium leading-none truncate mt-0.5">
                Fast native app experience · Instant APK downloads · Zero browser bar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 sm:px-4 py-1.5 rounded-lg bg-black hover:bg-stone-900 text-amber-300 font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install App</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-black/70 hover:text-black transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Manual Install Instructions Modal for iOS Safari / Unsupported Browsers */}
      {showHowToModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#160f0b] border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-2">
              <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Add to Home Screen (PWA)</span>
              </h3>
              <button 
                onClick={() => setShowHowToModal(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="p-3 rounded-xl bg-[#1d140e] border border-amber-500/15 space-y-1.5">
                <div className="font-bold text-amber-400 flex items-center gap-1">
                  <span>For Android (Chrome / Edge / Brave):</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Tap the browser menu <strong className="text-white">(⋮)</strong> at top-right, then select <strong className="text-amber-300">"Add to Home screen"</strong> or <strong className="text-amber-300">"Install app"</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1d140e] border border-amber-500/15 space-y-1.5">
                <div className="font-bold text-amber-400 flex items-center gap-1">
                  <span>For iOS (Safari):</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Tap the <strong className="text-white">Share button</strong> (square with up arrow) in the bottom bar, scroll down and tap <strong className="text-amber-300">"Add to Home Screen"</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHowToModal(false)}
              className="w-full py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
