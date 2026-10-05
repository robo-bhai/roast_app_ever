import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Sparkles, Download, Code2, LayoutDashboard, 
  Store, MessageSquarePlus, Menu, X 
} from 'lucide-react';
import { AppModel } from '../types/app';

interface NavbarProps {
  apps: AppModel[];
  onSelectApp: (app: AppModel) => void;
  activeView: 'store' | 'admin' | 'django-code';
  setActiveView: (view: 'store' | 'admin' | 'django-code') => void;
  onDownloadApk: (app: AppModel) => void;
  onOpenDemandModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  apps,
  onSelectApp,
  activeView,
  setActiveView,
  onDownloadApk,
  onOpenDemandModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter apps matching search query
  const searchResults = searchQuery.trim().length >= 1
    ? apps.filter(app =>
        app.app_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.developer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.package_name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement !== inputRef.current)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = searchResults[selectedIndex];
      if (selected) {
        onSelectApp(selected);
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#120e0b]/95 backdrop-blur-xl border-b border-amber-500/15 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Wordmark (Compact on mobile) */}
        <button
          onClick={() => {
            setActiveView('store');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 sm:gap-3 shrink-0 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl"
          aria-label="Hadi88 Apps Home"
        >
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-black font-display font-black text-base sm:text-2xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-all">
            H
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base sm:text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
              Hadi88<span className="text-amber-400 ml-0.5">Apps</span>
            </span>
            <span className="hidden lg:block text-[10px] text-amber-300/80 font-medium tracking-tight -mt-0.5 truncate max-w-[210px]">
              Find and ask for your dreaming apps
            </span>
          </div>
        </button>

        {/* Real-time Live Search Bar (Sleek on mobile) */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-md lg:max-w-lg mx-1 sm:mx-3">
          <div className="relative">
            <Search className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400/80" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
                setSelectedIndex(0);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDownInInput}
              placeholder="Search apps..."
              className="w-full bg-[#1c1510]/90 text-[11px] sm:text-sm text-[#f5ede4] placeholder-stone-400 rounded-xl sm:rounded-2xl pl-8 sm:pl-10 pr-8 sm:pr-12 py-1.5 sm:py-2.5 border border-amber-500/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 focus:bg-[#221812] transition-all h-9 sm:h-11"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[9px] font-mono text-stone-400 px-1 py-0.5 rounded bg-stone-900/80 border border-amber-500/10">
              <span>⌘K</span>
            </div>
          </div>

          {/* Live Search Results Dropdown */}
          {isDropdownOpen && searchQuery.trim().length >= 1 && (
            <div className="absolute top-full mt-1.5 w-full glass-panel rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-2xl z-50 max-h-80 sm:max-h-96 overflow-y-auto border border-amber-500/25">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-stone-400 flex items-center justify-between border-b border-amber-500/10">
                    <span>Matches ({searchResults.length})</span>
                    <span className="text-[9px]">Tap to view</span>
                  </div>
                  {searchResults.map((app, index) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        onSelectApp(app);
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className={`flex items-center gap-2.5 p-2 rounded-lg sm:rounded-xl cursor-pointer transition-colors ${
                        selectedIndex === index ? 'bg-amber-500/20 text-white' : 'hover:bg-amber-500/10 text-stone-200'
                      }`}
                    >
                      <img
                        src={app.app_icon}
                        alt={app.app_name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-cover bg-stone-900 border border-amber-500/20 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold truncate flex items-center gap-1">
                          <span>{app.app_name}</span>
                          {app.featured && (
                            <span className="text-[8px] text-amber-400 bg-amber-400/10 px-1 rounded border border-amber-400/20">
                              Top
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] sm:text-xs text-stone-400 truncate">
                          {app.developer_name} · <span className="text-amber-300/80">{app.category}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-1.5">
                        <div>
                          <div className="text-[11px] sm:text-xs font-bold text-amber-400">★ {app.rating}</div>
                          <div className="text-[9px] sm:text-[10px] text-stone-500">{app.file_size}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadApk(app);
                          }}
                          title="Instant APK Download"
                          className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 transition-colors"
                        >
                          <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-stone-400">
                  No applications found for "{searchQuery}".
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenDemandModal();
                    }}
                    className="block mx-auto mt-1.5 text-amber-400 font-bold hover:underline text-[11px]"
                  >
                    Request this app from our team →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 3: Navigation Views & Primary Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveView('store')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'store'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                : 'text-stone-300 hover:text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Store</span>
          </button>

          <button
            onClick={onOpenDemandModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 transition-all shadow-sm"
            title="Ask for your dreaming app - We build on demand"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask for App</span>
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'admin'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                : 'text-stone-300 hover:text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => setActiveView('django-code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              activeView === 'django-code'
                ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/25 font-bold'
                : 'border-amber-500/20 bg-stone-900/60 text-stone-300 hover:text-amber-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Django Code</span>
          </button>
        </div>

        {/* Mobile Hamburger & Ask Action */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={onOpenDemandModal}
            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 h-8"
          >
            <MessageSquarePlus className="w-3 h-3 text-amber-400" />
            <span>Ask</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg glass-panel text-stone-300 hover:text-white h-8 w-8 flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-amber-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-amber-500/20 px-3 py-3 space-y-1.5 animate-fade-in bg-[#140e0b]">
          <div className="text-[10px] text-amber-300/80 font-medium px-2 mb-1">
            "We are building app on your demand"
          </div>

          <button
            onClick={() => {
              setActiveView('store');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'store'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-stone-300 hover:bg-amber-500/10'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>App Storefront</span>
          </button>

          <button
            onClick={() => {
              onOpenDemandModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Contact Admin / Ask for App</span>
          </button>

          <button
            onClick={() => {
              setActiveView('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'admin'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-stone-300 hover:bg-amber-500/10'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Management & Client Demands</span>
          </button>

          <button
            onClick={() => {
              setActiveView('django-code');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'django-code'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-stone-300 hover:bg-amber-500/10'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Django Source Code (.zip)</span>
          </button>
        </div>
      )}

    </header>
  );
};
