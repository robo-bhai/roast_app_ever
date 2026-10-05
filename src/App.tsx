/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_APPS } from './data/initialApps';
import { AppModel, AppCategory, AppDemandRequest } from './types/app';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryFilter } from './components/CategoryFilter';
import { AppCard } from './components/AppCard';
import { Pagination } from './components/Pagination';
import { AppDetailModal } from './components/AppDetailModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DjangoCodeViewer } from './components/DjangoCodeViewer';
import { ContactAdminModal } from './components/ContactAdminModal';
import { downloadAppApk } from './utils/apkGenerator';
import { 
  Sparkles, ShieldAlert, Layers, ShieldCheck, 
  MessageSquarePlus, Smartphone 
} from 'lucide-react';

const CATEGORIES: AppCategory[] = [
  'All',
  'Games',
  'Productivity',
  'Tools',
  'Social',
  'Entertainment',
  'Finance',
  'Photography',
  'Health & Fitness',
];

const ITEMS_PER_PAGE = 18; // Exactly 18 apps per page requirement

const INITIAL_DEMANDS: AppDemandRequest[] = [
  {
    id: 'demand-1',
    userName: 'Khurram Shah',
    email: 'khurram@example.com',
    contactMethod: 'WhatsApp',
    contactHandle: '+92 300 1234567',
    appTitle: 'Solar Grid Inverter IoT Monitor',
    platform: 'Android',
    category: 'Tools',
    requirements: 'Real-time Bluetooth BLE & Wi-Fi telemetry for hybrid solar inverters. Needs daily yield graphs, battery state of charge (SoC) gauges, and push notifications for grid power cuts.',
    timeline: '2-4 Weeks',
    budget: '$1,500 - $2,500',
    status: 'In Review',
    submittedAt: '2026-10-02T14:20:00Z',
  },
  {
    id: 'demand-2',
    userName: 'Elena Rostova',
    email: 'elena.rostova@designworks.io',
    contactMethod: 'Telegram',
    contactHandle: '@elena_craft',
    appTitle: 'Ceramic Studio Glaze Formula Calculator',
    platform: 'Cross-Platform',
    category: 'Productivity',
    requirements: 'A precise chemistry recipe builder for ceramic glaze firing. Calculates unity molecular formulas (UMF), Seger cone melting curves, and batch weighing scales with offline SQLite sync.',
    timeline: '1-2 Months',
    budget: '$3,000 - $5,000',
    status: 'Approved',
    submittedAt: '2026-10-03T09:15:00Z',
  }
];

export default function App() {
  const [apps, setApps] = useState<AppModel[]>(() => {
    try {
      const saved = localStorage.getItem('hadi88_apps_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_APPS;
  });

  const [demands, setDemands] = useState<AppDemandRequest[]>(() => {
    try {
      const saved = localStorage.getItem('hadi88_client_demands');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_DEMANDS;
  });

  const [activeView, setActiveView] = useState<'store' | 'admin' | 'django-code'>('store');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedApp, setSelectedApp] = useState<AppModel | null>(null);
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('hadi88_apps_data', JSON.stringify(apps));
    } catch {
      // Ignore quota
    }
  }, [apps]);

  useEffect(() => {
    try {
      localStorage.setItem('hadi88_client_demands', JSON.stringify(demands));
    } catch {
      // Ignore quota
    }
  }, [demands]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadApk = (app: AppModel) => {
    downloadAppApk(app, (appId) => {
      setApps((prevApps) =>
        prevApps.map((a) =>
          a.id === appId ? { ...a, downloads_count: a.downloads_count + 1 } : a
        )
      );
      showToast(`Initiated download for ${app.app_name} (${app.file_size})`);
    });
  };

  const handleAddApp = (newApp: AppModel) => {
    setApps((prev) => [newApp, ...prev]);
    showToast(`Successfully published ${newApp.app_name}!`);
  };

  const handleUpdateApp = (updatedApp: AppModel) => {
    setApps((prev) => prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)));
    if (selectedApp && selectedApp.id === updatedApp.id) {
      setSelectedApp(updatedApp);
    }
    showToast(`Updated ${updatedApp.app_name}`);
  };

  const handleDeleteApp = (appId: string) => {
    setApps((prev) => prev.filter((a) => a.id !== appId));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(null);
    }
    showToast('Application removed from store');
  };

  const handleSubmitDemand = (newDemand: AppDemandRequest) => {
    setDemands((prev) => [newDemand, ...prev]);
    showToast(`Application demand for "${newDemand.appTitle}" sent to Hadi88 team!`);
  };

  const handleUpdateDemandStatus = (demandId: string, newStatus: AppDemandRequest['status']) => {
    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, status: newStatus } : d))
    );
    showToast(`Demand status updated to "${newStatus}"`);
  };

  const handleDeleteDemand = (demandId: string) => {
    setDemands((prev) => prev.filter((d) => d.id !== demandId));
    showToast('Demand request deleted');
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: apps.length };
    apps.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [apps]);

  const filteredApps = useMemo(() => {
    if (selectedCategory === 'All') return apps;
    return apps.filter((a) => a.category === selectedCategory);
  }, [apps, selectedCategory]);

  const featuredApps = useMemo(() => {
    const explicitlyFeatured = apps.filter((a) => a.featured);
    if (explicitlyFeatured.length >= 3) return explicitlyFeatured;
    return apps.slice(0, 4);
  }, [apps]);

  const paginatedApps = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApps.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredApps, currentPage]);

  const handleCategoryChange = (cat: AppCategory) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0a08] text-[#f7efe6] selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-700/5 rounded-full blur-[160px]" />
      </div>

      {/* Top Navigation */}
      <Navbar
        apps={apps}
        onSelectApp={(app) => setSelectedApp(app)}
        activeView={activeView}
        setActiveView={setActiveView}
        onDownloadApk={handleDownloadApk}
        onOpenDemandModal={() => setIsDemandModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 glass-panel border border-amber-500/40 text-amber-200 text-[11px] sm:text-xs font-semibold px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2 animate-bounce max-w-xs sm:max-w-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Brand Sub-Header Banner with Small Responsive Fonts */}
      <div className="relative z-10 bg-[#160f0b]/80 border-b border-amber-500/10 py-1.5 sm:py-2.5 px-3 sm:px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-6 text-[10px] sm:text-xs">
          <span className="text-amber-300 font-bold tracking-tight">
            "Find and ask for your dreaming apps"
          </span>
          <span className="hidden sm:inline text-amber-500/40">·</span>
          <span className="text-stone-300 font-medium">
            "We are building app on your demand"
          </span>
          <button
            onClick={() => setIsDemandModalOpen(true)}
            className="text-amber-400 hover:text-amber-300 font-bold underline decoration-amber-500/40 underline-offset-2 cursor-pointer text-[10px] sm:text-xs"
          >
            Submit your app requirement →
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-10">
        
        {/* VIEW 1: Storefront Catalog */}
        {activeView === 'store' && (
          <div className="space-y-6 sm:space-y-10">
            {/* Top Trending / Hero Carousel */}
            <HeroCarousel
              featuredApps={featuredApps}
              onSelectApp={(app) => setSelectedApp(app)}
              onDownloadApk={handleDownloadApk}
              onOpenDemandModal={() => setIsDemandModalOpen(true)}
            />

            {/* Custom On-Demand App Callout Banner (Compact for Mobile) */}
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-amber-500/25 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 sm:gap-5 bg-gradient-to-r from-[#18110b] via-[#1f150e] to-[#18110b]">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Hadi88 Apps On-Demand Service</span>
                </div>
                <h2 className="text-base sm:text-2xl font-display font-extrabold text-white">
                  Have a Unique Application Idea in Mind?
                </h2>
                <p className="text-[11px] sm:text-sm text-stone-300 leading-relaxed">
                  Tell our dedicated software engineers what features, APIs, and workflows you envision. We architect, build, and deliver high-performance Android, iOS, and Web applications.
                </p>
                <div className="pt-0.5 flex items-center gap-1.5 text-[9px] sm:text-[11px] text-stone-400">
                  <ShieldAlert className="w-3 h-3 text-amber-400/80 shrink-0" />
                  <span>Strict policy: We never develop any illegal, modded, gambling, or theft category software.</span>
                </div>
              </div>

              <button
                onClick={() => setIsDemandModalOpen(true)}
                className="w-full lg:w-auto px-4 sm:px-6 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition-all hover:scale-102 shrink-0"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Ask for App</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              categoryCounts={categoryCounts}
            />

            {/* App Grid Header with 18-items indicator */}
            <section className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-amber-500/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-2xl font-display font-bold text-white tracking-tight">
                    {selectedCategory === 'All' ? 'All Applications' : `${selectedCategory} Applications`}
                  </h2>
                  <span className="text-[10px] sm:text-xs font-mono text-amber-400/90 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    18 / page
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-stone-400">
                  Showing {paginatedApps.length} of {filteredApps.length} applications
                </div>
              </div>

              {/* Grid: 2 cols on mobile with compact cards, 3 on tablet, 6 on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
                {paginatedApps.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    onSelectApp={(a) => setSelectedApp(a)}
                    onDownloadApk={handleDownloadApk}
                  />
                ))}
              </div>

              {paginatedApps.length === 0 && (
                <div className="text-center py-12 glass-panel rounded-2xl space-y-2">
                  <Layers className="w-8 h-8 text-stone-600 mx-auto" />
                  <div className="text-sm font-bold text-stone-300">No applications in this category</div>
                  <button
                    onClick={() => handleCategoryChange('All')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    View all applications
                  </button>
                </div>
              )}

              {/* Exact 18 Apps Per Page Pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={filteredApps.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </section>
          </div>
        )}

        {/* VIEW 2: Admin Dashboard */}
        {activeView === 'admin' && (
          <AdminDashboard
            apps={apps}
            onAddApp={handleAddApp}
            onUpdateApp={handleUpdateApp}
            onDeleteApp={handleDeleteApp}
            onClose={() => setActiveView('store')}
            onSelectApp={(app) => setSelectedApp(app)}
            demands={demands}
            onUpdateDemandStatus={handleUpdateDemandStatus}
            onDeleteDemand={handleDeleteDemand}
          />
        )}

        {/* VIEW 3: Django Code & Architecture Hub */}
        {activeView === 'django-code' && (
          <DjangoCodeViewer />
        )}

      </main>

      {/* App Detail Modal */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onDownloadApk={handleDownloadApk}
          allApps={apps}
          onSelectApp={(app) => setSelectedApp(app)}
        />
      )}

      {/* Contact Admin / Demand an App Modal Form */}
      <ContactAdminModal
        isOpen={isDemandModalOpen}
        onClose={() => setIsDemandModalOpen(false)}
        onSubmitDemand={handleSubmitDemand}
      />

      {/* Footer with Small Responsive Fonts */}
      <footer className="relative z-10 mt-12 sm:mt-20 border-t border-amber-500/15 bg-[#0a0705] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-display font-black text-sm sm:text-base shadow-md shadow-amber-500/20">
                  H
                </div>
                <span className="font-display font-bold text-lg sm:text-xl text-white">
                  Hadi88<span className="text-amber-400 ml-0.5">Apps</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-300 font-medium">
                "Find and ask for your dreaming apps" · "We are building app on your demand"
              </p>
              <p className="text-[10px] sm:text-[11px] text-stone-500 max-w-md">
                Production-ready mobile software marketplace and bespoke engineering pipeline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-stone-300">
              <button
                onClick={() => { setActiveView('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors py-1"
              >
                Storefront
              </button>
              <button
                onClick={() => setIsDemandModalOpen(true)}
                className="text-amber-400 font-bold hover:text-amber-300 transition-colors py-1 flex items-center gap-1"
              >
                <MessageSquarePlus className="w-3 h-3" />
                <span>Ask for App</span>
              </button>
              <button
                onClick={() => { setActiveView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors py-1"
              >
                Admin Panel ({demands.length})
              </button>
              <button
                onClick={() => { setActiveView('django-code'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors py-1"
              >
                Django Code (.zip)
              </button>
            </div>

          </div>

          <div className="pt-4 sm:pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[10px] sm:text-xs text-stone-500">
            <div>
              <span>© 2026 Hadi88 Apps. Dark chocolate glassmorphism & amber accents.</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400">
              <ShieldCheck className="w-3 h-3 text-amber-500/80" />
              <span>Strict Legal Safety Policy Enforced</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
