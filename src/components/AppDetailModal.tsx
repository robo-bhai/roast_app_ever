import React, { useState } from 'react';
import { 
  X, Star, Download, ShieldCheck, ArrowLeft, Check, 
  ExternalLink, PackageCheck, Share2 
} from 'lucide-react';
import { AppModel } from '../types/app';

interface AppDetailModalProps {
  app: AppModel;
  onClose: () => void;
  onDownloadApk: (app: AppModel) => void;
  allApps: AppModel[];
  onSelectApp: (app: AppModel) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  onClose,
  onDownloadApk,
  allApps,
  onSelectApp,
}) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const relatedApps = allApps
    .filter((a) => a.category === app.category && a.id !== app.id)
    .slice(0, 4);

  const handleDownloadClick = () => {
    if (downloadProgress !== null) return;
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          onDownloadApk(app);
          setTimeout(() => setDownloadProgress(null), 2000);
          return 100;
        }
        return prev + 30;
      });
    }, 180);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex justify-center p-2 sm:p-4 md:p-8 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#140e0b] border border-amber-500/25 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Top Control Bar (Compact on mobile) */}
        <div className="sticky top-0 z-20 bg-[#140e0b]/95 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-3 border-b border-amber-500/15 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-[11px] font-semibold text-stone-300 hover:text-amber-400 transition-colors px-2 py-1 rounded-lg glass-panel"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="hidden sm:inline text-xs text-amber-500/40">|</span>
            <span className="hidden sm:inline text-[11px] text-stone-400">Hadi88 Verified Package</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-1 sm:px-2.5 rounded-lg glass-panel text-stone-300 hover:text-amber-400 text-[11px] flex items-center gap-1 transition-colors"
              title="Copy share link"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg glass-panel text-stone-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-6 overflow-y-auto">
          
          {/* Header Identity Block (Responsive mobile layout) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-4">
              <img
                src={app.app_icon}
                alt={app.app_name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover bg-stone-900 border border-amber-500/30 shadow-md shrink-0"
              />
              <div className="space-y-0.5">
                <h1 className="text-base sm:text-2xl font-display font-extrabold text-white tracking-tight leading-tight">
                  {app.app_name}
                </h1>
                <div className="text-[11px] sm:text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{app.developer_name}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-stone-400">
                  <span className="text-amber-300 font-medium">{app.category}</span>
                  <span>·</span>
                  <span>v{app.version}</span>
                  <span>·</span>
                  <span>{app.file_size}</span>
                </div>
              </div>
            </div>

            {/* Direct Install CTA */}
            <div className="w-full sm:w-auto shrink-0">
              <button
                onClick={handleDownloadClick}
                disabled={downloadProgress !== null}
                className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                  downloadProgress === 100
                    ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                    : downloadProgress !== null
                    ? 'bg-amber-500/40 text-amber-200 cursor-wait'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/25'
                }`}
              >
                {downloadProgress === 100 ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Download Ready</span>
                  </>
                ) : downloadProgress !== null ? (
                  <>
                    <Download className="w-3.5 h-3.5 animate-bounce" />
                    <span>Streaming {downloadProgress}%...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Install APK ({app.file_size})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar (Compact 4-column on mobile) */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center py-2 border-y border-amber-500/15">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#1b140f] border border-amber-500/10">
              <div className="text-[8px] sm:text-[10px] text-stone-400">Rating</div>
              <div className="text-xs sm:text-sm font-bold text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{app.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="p-1.5 sm:p-2 rounded-lg bg-[#1b140f] border border-amber-500/10">
              <div className="text-[8px] sm:text-[10px] text-stone-400">Downloads</div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">
                {app.downloads_count >= 1000000
                  ? `${(app.downloads_count / 1000000).toFixed(1)}M`
                  : `${Math.floor(app.downloads_count / 1000)}K`}
              </div>
            </div>

            <div className="p-1.5 sm:p-2 rounded-lg bg-[#1b140f] border border-amber-500/10">
              <div className="text-[8px] sm:text-[10px] text-stone-400">Size</div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">{app.file_size}</div>
            </div>

            <div className="p-1.5 sm:p-2 rounded-lg bg-[#1b140f] border border-amber-500/10">
              <div className="text-[8px] sm:text-[10px] text-stone-400">Platform</div>
              <div className="text-xs sm:text-sm font-bold text-stone-300 font-mono mt-0.5">APK</div>
            </div>
          </div>

          {/* Banner & Screenshots */}
          {app.banner_image && (
            <div className="space-y-1.5">
              <div className="rounded-xl overflow-hidden border border-amber-500/20 shadow-md bg-stone-950">
                <img
                  src={app.banner_image}
                  alt={`${app.app_name} preview`}
                  referrerPolicy="no-referrer"
                  className="w-full h-36 sm:h-56 object-cover"
                />
              </div>
            </div>
          )}

          {/* Description & Technical details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="md:col-span-2 space-y-2">
              <h2 className="text-xs sm:text-sm font-display font-bold text-white">About this app</h2>
              <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed whitespace-pre-line">
                {app.description}
              </p>

              {app.whats_new && (
                <div className="pt-2 border-t border-amber-500/10 space-y-1">
                  <h3 className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-wider">What's New in v{app.version}</h3>
                  <div className="p-2 rounded-lg bg-[#18110b] border border-amber-500/15 text-[10px] sm:text-[11px] text-stone-300 font-mono">
                    {app.whats_new}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Specifications */}
            <div className="glass-panel rounded-xl p-3 space-y-2 border border-amber-500/20 h-fit">
              <h3 className="text-[11px] sm:text-xs font-display font-bold text-white flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Package Info</span>
              </h3>

              <div className="space-y-1.5 text-[9px] sm:text-[10px]">
                <div>
                  <div className="text-stone-400">Package Identifier</div>
                  <div className="font-mono text-amber-300 break-all mt-0.5">{app.package_name}</div>
                </div>
                <div>
                  <div className="text-stone-400">Binary</div>
                  <div className="font-mono text-white mt-0.5">{app.apk_file}</div>
                </div>
                <div>
                  <div className="text-stone-400">Security</div>
                  <div className="text-emerald-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Clean APK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Apps in Same Category */}
          {relatedApps.length > 0 && (
            <div className="pt-3 border-t border-amber-500/15 space-y-2">
              <h3 className="text-xs font-display font-bold text-white">Similar in {app.category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {relatedApps.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectApp(rel)}
                    className="p-2 rounded-xl glass-panel hover:border-amber-400/40 cursor-pointer flex items-center gap-2"
                  >
                    <img src={rel.app_icon} alt={rel.app_name} className="w-8 h-8 rounded-lg object-cover bg-stone-900 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-white truncate">{rel.app_name}</div>
                      <div className="text-[9px] text-amber-400">★ {rel.rating.toFixed(1)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
