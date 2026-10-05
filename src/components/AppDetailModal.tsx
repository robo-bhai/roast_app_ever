import React, { useState } from 'react';
import { 
  X, Star, Download, ShieldCheck, ArrowLeft, Check, 
  ExternalLink, Calendar, HardDrive, Cpu, PackageCheck, Share2 
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex justify-center p-3 sm:p-6 md:p-10 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#140e0b] border border-amber-500/25 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Top Control Bar */}
        <div className="sticky top-0 z-20 bg-[#140e0b]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-amber-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-amber-400 transition-colors min-h-[44px] px-2 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <span className="hidden sm:inline text-xs text-amber-500/60">|</span>
            <span className="hidden sm:inline text-[11px] text-stone-400">Hadi88 Apps Verified Package</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 sm:px-3 rounded-xl glass-panel text-stone-300 hover:text-amber-400 hover:border-amber-400 text-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
              title="Copy share link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-panel text-stone-400 hover:text-white hover:border-amber-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[82vh]">
          
          {/* Header Identity Block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={app.app_icon}
                alt={app.app_name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-stone-900 border border-amber-500/30 shadow-xl shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    {app.app_name}
                  </h1>
                </div>
                <div className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{app.developer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span className="text-amber-300/80">{app.category}</span>
                  <span>·</span>
                  <span>Version {app.version}</span>
                  <span>·</span>
                  <span>{app.content_rating || 'Everyone'}</span>
                </div>
              </div>
            </div>

            {/* Direct Install CTA */}
            <div className="w-full sm:w-auto shrink-0">
              <button
                onClick={handleDownloadClick}
                disabled={downloadProgress !== null}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                  downloadProgress === 100
                    ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                    : downloadProgress !== null
                    ? 'bg-amber-500/40 text-amber-200 cursor-wait'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/25 hover:scale-102'
                }`}
              >
                {downloadProgress === 100 ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Download Ready</span>
                  </>
                ) : downloadProgress !== null ? (
                  <>
                    <Download className="w-4 h-4 animate-bounce" />
                    <span>Streaming {downloadProgress}%...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Install APK ({app.file_size})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center py-4 border-y border-amber-500/15">
            <div className="p-3 rounded-2xl bg-[#1b140f] border border-amber-500/10">
              <div className="text-[11px] text-stone-400 font-medium">Rating</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{app.rating.toFixed(1)}</span>
              </div>
              <div className="text-[10px] text-stone-500">{app.reviews_count?.toLocaleString() || '12.4K'} reviews</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#1b140f] border border-amber-500/10">
              <div className="text-[11px] text-stone-400 font-medium">Downloads</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">
                {app.downloads_count >= 1000000
                  ? `${(app.downloads_count / 1000000).toFixed(1)}M+`
                  : `${Math.floor(app.downloads_count / 1000)}K+`}
              </div>
              <div className="text-[10px] text-stone-500">Verified installs</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#1b140f] border border-amber-500/10">
              <div className="text-[11px] text-stone-400 font-medium">Package Size</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{app.file_size}</div>
              <div className="text-[10px] text-stone-500">Android APK</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#1b140f] border border-amber-500/10">
              <div className="text-[11px] text-stone-400 font-medium">Architecture</div>
              <div className="text-lg font-bold text-stone-300 font-mono text-xs mt-1">arm64-v8a</div>
              <div className="text-[10px] text-stone-500">{app.min_android_version || 'Android 10+'}</div>
            </div>
          </div>

          {/* Banner & Screenshots Section */}
          {app.banner_image && (
            <div className="space-y-3">
              <h2 className="text-sm font-display font-bold text-white tracking-wide uppercase">Screenshots & Artwork</h2>
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-xl bg-stone-950">
                <img
                  src={app.banner_image}
                  alt={`${app.app_name} preview`}
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>
            </div>
          )}

          {/* Description & Release Notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-base font-display font-bold text-white">About this app</h2>
              <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                {app.description}
              </p>

              {app.whats_new && (
                <div className="pt-4 border-t border-amber-500/10 space-y-2">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">What's New in v{app.version}</h3>
                  <div className="p-4 rounded-xl bg-[#18110b] border border-amber-500/15 text-xs text-stone-300 whitespace-pre-line leading-relaxed font-mono">
                    {app.whats_new}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Specifications */}
            <div className="glass-panel rounded-2xl p-5 space-y-4 border border-amber-500/20 h-fit">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-amber-400" />
                <span>Technical Specs</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-stone-400 text-[11px]">Package Name</div>
                  <div className="font-mono text-amber-300 break-all mt-0.5">{app.package_name}</div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Binary File</div>
                  <div className="font-mono text-white mt-0.5">{app.apk_file}</div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Minimum OS</div>
                  <div className="text-white mt-0.5">{app.min_android_version || 'Android 10.0 (API 29)'}</div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Last Updated</div>
                  <div className="text-white mt-0.5">{new Date(app.updated_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Signature</div>
                  <div className="font-mono text-[10px] text-stone-400 break-all mt-0.5">
                    SHA256: 7F:8E:B2:4A:19:9C:20:88
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Apps */}
          {relatedApps.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-amber-500/15">
              <h2 className="text-sm font-display font-bold text-white">Similar in {app.category}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedApps.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectApp(rel)}
                    className="glass-panel glass-panel-hover rounded-xl p-3 cursor-pointer flex items-center gap-3 border border-amber-500/15"
                  >
                    <img
                      src={rel.app_icon}
                      alt={rel.app_name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-stone-900 border border-amber-500/20"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{rel.app_name}</div>
                      <div className="text-[11px] text-amber-400 font-bold">★ {rel.rating.toFixed(1)}</div>
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
