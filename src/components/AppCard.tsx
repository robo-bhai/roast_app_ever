import React, { useState } from 'react';
import { Star, Download, Check } from 'lucide-react';
import { AppModel } from '../types/app';

interface AppCardProps {
  app: AppModel;
  onSelectApp: (app: AppModel) => void;
  onDownloadApk: (app: AppModel) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onSelectApp, onDownloadApk }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;
    setDownloading(true);

    setTimeout(() => {
      onDownloadApk(app);
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 600);
  };

  return (
    <div
      onClick={() => onSelectApp(app)}
      className="group relative glass-panel glass-panel-hover rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between cursor-pointer transition-all border border-amber-500/15 hover:border-amber-400/40"
    >
      <div>
        {/* App Icon Container */}
        <div className="relative mb-2 sm:mb-3.5">
          <img
            src={app.app_icon}
            alt={app.app_name}
            referrerPolicy="no-referrer"
            className="w-full aspect-square rounded-xl sm:rounded-2xl object-cover bg-stone-900 border border-amber-500/15 group-hover:scale-102 group-hover:border-amber-400/40 transition-all duration-200"
          />
          {app.featured && (
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[8px] sm:text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-amber-500/90 text-black shadow-sm">
              Top
            </div>
          )}
        </div>

        {/* Title and Developer (Small fonts on mobile) */}
        <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 truncate transition-colors leading-snug">
          {app.app_name}
        </h3>
        <p className="text-[10px] sm:text-xs text-stone-400 truncate mt-0.5">
          {app.developer_name}
        </p>

        {/* Quiet unboxed metadata */}
        <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-stone-400 mt-1 sm:mt-2">
          <span className="text-amber-300/90 font-medium truncate max-w-[80px] sm:max-w-none">{app.category}</span>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <span className="font-mono text-[9px] sm:text-[11px]">{app.file_size}</span>
        </div>
      </div>

      {/* Card Footer: Rating & Direct Download Action */}
      <div className="pt-2.5 sm:pt-3.5 mt-2 sm:mt-3 border-t border-amber-500/10 space-y-1.5 sm:space-y-2.5">
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <div className="flex items-center gap-0.5 font-bold text-amber-400">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
            <span>{app.rating.toFixed(1)}</span>
          </div>
          <span className="text-stone-400 text-[9px] sm:text-[11px] font-mono tabular-nums">
            {app.downloads_count >= 1000000
              ? `${(app.downloads_count / 1000000).toFixed(1)}M`
              : app.downloads_count >= 1000
              ? `${Math.floor(app.downloads_count / 1000)}K`
              : app.downloads_count} dl
          </span>
        </div>

        <button
          onClick={handleDownloadClick}
          disabled={downloading}
          className={`w-full py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all min-h-[38px] sm:min-h-[44px] ${
            downloaded
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : downloading
              ? 'bg-amber-500/30 text-amber-300 animate-pulse cursor-wait'
              : 'bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/25 hover:border-amber-400 shadow-sm'
          }`}
        >
          {downloaded ? (
            <>
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Installed</span>
            </>
          ) : downloading ? (
            <span>Downloading...</span>
          ) : (
            <>
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Install (APK)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
