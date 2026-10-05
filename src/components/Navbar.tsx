import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Sparkles, Download, Code2, LayoutDashboard, 
  Store, MessageSquarePlus, Menu, X, ShieldCheck 
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 md:gap-4">
        
        {/* Zone 1: Brand Wordmark (Hadi88 Apps) */}
        <button
          onClick={() => {
            setActiveView('store');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl"
          aria-label="Hadi88 Apps Home"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-black font-display font-black text-xl sm:text-2xl shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-all">
            H
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
              Hadi88<span className="text-amber-400 ml-1">Apps</span>
            </span>
            <span className="hidden lg:block text-[10px] text-amber-300/80 font-medium tracking-tight -mt-0.5 truncate max-w-[210px]">
              Find and ask for your dreaming apps
            </span>
          </div>
        </button>

        {/* Zone 2: Real-time Live Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md lg:max-w-lg mx-1 sm:mx-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/80" />
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
              placeholder="Search apps, tools, games..."
              className="w-full bg-[#1c1510]/90 text-xs sm:text-sm text-[#f5ede4] placeholder-stone-400 rounded-2xl pl-10 pr-12 py-2.5 border border-amber-500/20 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 focus:bg-[#221812] transition-all min-h-[44px]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[10px] font-mono text-stone-400 px-1.5 py-0.5 rounded bg-stone-900/80 border border-amber-500/10">
              <span>⌘K</span>
            </div>
          </div>

          {/* Live Search Results Dropdown */}
          {isDropdownOpen && searchQuery.trim().length >= 1 && (
            <div className="absolute top-full mt-2 w-full glass-panel rounded-2xl p-2 shadow-2xl z-50 max-h-96 overflow-y-auto border border-amber-500/25">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 flex items-center justify-between border-b border-amber-500/10">
                    <span>Matching Apps ({searchResults.length})</span>
                    <span className="text-[10px]">Tap to view details</span>
                  </div>
                  {searchResults.map((app, index) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        onSelectApp(app);
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                        selectedIndex === index ? 'bg-amber-500/20 text-white' : 'hover:bg-amber-500/10 text-stone-200'
                      }`}
                    >
                      <img
                        src={app.app_icon}
                        alt={app.app_name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover bg-stone-900 border border-amber-500/20 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate flex items-center gap-1.5">
                          <span>{app.app_name}</span>
                          {app.featured && (
                            <span className="text-[9px] text-amber-400 bg-amber-400/10 px-1 rounded border border-amber-400/20">
                              Top
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-400 truncate">
                          {app.developer_name} · <span className="text-amber-300/80">{app.category}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <div>
                          <div className="text-xs font-bold text-amber-400">★ {app.rating}</div>
                          <div className="text-[10px] text-stone-500">{app.file_size}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadApk(app);
                          }}
                          title="Instant APK Download"
                          className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-stone-400">
                  No applications found matching "{searchQuery}".
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenDemandModal();
                    }}
                    className="block mx-auto mt-2 text-amber-400 font-bold hover:underline"
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
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
              activeView === 'store'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold'
                : 'text-stone-300 hover:text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Store</span>
          </button>

          {/* Ask for App / Demand Button */}
          <button
            onClick={onOpenDemandModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 transition-all shadow-sm min-h-[44px]"
            title="Ask for your dreaming app - We build on demand"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask for App</span>
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
              activeView === 'admin'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold'
                : 'text-stone-300 hover:text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => setActiveView('django-code')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[44px] ${
              activeView === 'django-code'
                ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/25 font-bold'
                : 'border-amber-500/20 bg-stone-900/60 text-stone-300 hover:text-amber-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Django Code</span>
          </button>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={onOpenDemandModal}
            className="px-2.5 py-2 rounded-xl text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 min-h-[44px]"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl glass-panel text-stone-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-amber-500/20 px-4 py-4 space-y-2 animate-fade-in bg-[#140e0b]">
          <div className="text-[11px] text-amber-300/80 font-semibold px-2 mb-1">
            "We are building app on your demand"
          </div>

          <button
            onClick={() => {
              setActiveView('store');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
              activeView === 'store'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-stone-300 hover:bg-amber-500/10'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>App Storefront</span>
          </button>

          <button
            onClick={() => {
              onOpenDemandModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 min-h-[44px]"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
            <span>Contact Admin / Ask for App</span>
          </button>

          <button
            onClick={() => {
              setActiveView('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
              activeView === 'admin'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-stone-300 hover:bg-amber-500/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Management & Client Demands</span>
          </button>

          <button
            onClick={() => {
              setActiveView('django-code');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
              activeView === 'django-code'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-stone-300 hover:bg-amber-500/10'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Django Source Code & Architecture Hub</span>
          </button>
        </div>
      )}

    </header>
  );
};
