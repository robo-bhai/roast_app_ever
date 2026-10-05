import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Download, Star, 
  ExternalLink, ShieldCheck, MessageSquarePlus, Sparkles 
} from 'lucide-react';
import { AppModel } from '../types/app';

interface HeroCarouselProps {
  featuredApps: AppModel[];
  onSelectApp: (app: AppModel) => void;
  onDownloadApk: (app: AppModel) => void;
  onOpenDemandModal: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  featuredApps,
  onSelectApp,
  onDownloadApk,
  onOpenDemandModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isHovered || featuredApps.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, featuredApps.length]);

  if (!featuredApps || featuredApps.length === 0) return null;

  const currentApp = featuredApps[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredApps.length) % featuredApps.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
  };

  return (
    <section 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-3xl overflow-hidden glass-panel border border-amber-500/20 shadow-2xl transition-all"
    >
      {/* Background Graphic Layer with Dark Chocolate Scrim */}
      <div className="relative min-h-[380px] sm:min-h-[420px] md:min-h-[460px] flex flex-col justify-end p-4 sm:p-7 md:p-10">
        
        {/* Banner image with responsive scrim overlays */}
        {currentApp.banner_image && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={currentApp.banner_image}
              alt={currentApp.app_name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-700 ease-out"
            />
            {/* Scrims to guarantee WCAG AA legibility across all screens */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a08] via-[#0e0a08]/85 to-[#0e0a08]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0a08] via-[#0e0a08]/75 to-transparent" />
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl space-y-3.5 sm:space-y-4">
          
          {/* Brand Taglines Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="tracking-wide uppercase text-[11px] font-bold text-amber-300">
              Hadi88 Apps Spotlight
            </span>
            <span className="text-stone-500 hidden sm:inline">·</span>
            <span className="text-stone-300 italic text-[11px]">
              "Find and ask for your dreaming apps"
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            {currentApp.app_name}
          </h1>

          {/* Description */}
          <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 max-w-2xl">
            {currentApp.description}
          </p>

          {/* Metadata Row: Clean unboxed layout */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-stone-300 pt-0.5">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 inline" />
              <span>{currentApp.developer_name}</span>
            </span>
            <span className="text-stone-600" aria-hidden="true">·</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentApp.rating}</span>
            </span>
            <span className="text-stone-600" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-stone-300">
              {currentApp.downloads_count.toLocaleString()} installs
            </span>
            <span className="text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-stone-300 hidden sm:inline">{currentApp.file_size}</span>
          </div>

          {/* Primary Action Buttons (Responsive & Touch-Friendly) */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => onSelectApp(currentApp)}
              className="px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-102 min-h-[44px]"
            >
              <span>Explore Details</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDownloadApk(currentApp)}
              className="px-4 sm:px-5 py-3 rounded-2xl bg-[#1c1510]/80 hover:bg-[#251b14] text-amber-300 border border-amber-500/30 hover:border-amber-400 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all min-h-[44px]"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download APK ({currentApp.file_size})</span>
            </button>

            {/* Custom On-Demand Button */}
            <button
              onClick={onOpenDemandModal}
              className="px-4 sm:px-5 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all min-h-[44px]"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-400" />
              <span>Ask for Custom App</span>
            </button>
          </div>
        </div>

        {/* Carousel Slide Indicators & Arrows */}
        <div className="relative z-10 mt-6 pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {featuredApps.map((app, idx) => (
              <button
                key={app.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx
                    ? 'w-8 bg-amber-400 shadow-sm shadow-amber-400/50'
                    : 'w-2 bg-stone-700 hover:bg-stone-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-xl bg-stone-900/70 hover:bg-amber-500 hover:text-black text-stone-300 border border-amber-500/20 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Previous Featured App"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 sm:p-2.5 rounded-xl bg-stone-900/70 hover:bg-amber-500 hover:text-black text-stone-300 border border-amber-500/20 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Next Featured App"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
