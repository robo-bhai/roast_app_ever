import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Download, Layers, Star, 
  X, Shield, MessageSquarePlus, Clock, ExternalLink 
} from 'lucide-react';
import { AppModel, AppCategory, AppDemandRequest } from '../types/app';

interface AdminDashboardProps {
  apps: AppModel[];
  onAddApp: (newApp: AppModel) => void;
  onUpdateApp: (updatedApp: AppModel) => void;
  onDeleteApp: (appId: string) => void;
  onClose: () => void;
  onSelectApp: (app: AppModel) => void;
  demands: AppDemandRequest[];
  onUpdateDemandStatus: (demandId: string, newStatus: AppDemandRequest['status']) => void;
  onDeleteDemand: (demandId: string) => void;
}

const CATEGORIES: AppCategory[] = [
  'Games',
  'Productivity',
  'Tools',
  'Social',
  'Entertainment',
  'Finance',
  'Photography',
  'Health & Fitness'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  apps,
  onAddApp,
  onUpdateApp,
  onDeleteApp,
  onClose,
  onSelectApp,
  demands,
  onUpdateDemandStatus,
  onDeleteDemand,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'demands'>('apps');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [demandStatusFilter, setDemandStatusFilter] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppModel | null>(null);
  const [deletingAppId, setDeletingAppId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    app_name: '',
    package_name: '',
    developer_name: '',
    category: 'Productivity' as AppCategory,
    version: '1.0.0',
    file_size: '35 MB',
    rating: 4.5,
    description: '',
    whats_new: '',
    apk_file: '',
    featured: false,
  });

  const totalDownloads = apps.reduce((acc, a) => acc + a.downloads_count, 0);
  const avgRating = apps.length > 0
    ? (apps.reduce((acc, a) => acc + a.rating, 0) / apps.length).toFixed(2)
    : '0.00';

  const filteredApps = apps.filter(app => {
    const matchesSearch = 
      app.app_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.developer_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.package_name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredDemands = demands.filter(d => {
    if (demandStatusFilter !== 'All' && d.status !== demandStatusFilter) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingApp(null);
    setFormData({
      app_name: '',
      package_name: '',
      developer_name: 'Hadi88 Studio',
      category: 'Productivity',
      version: '1.0.0',
      file_size: '35 MB',
      rating: 4.5,
      description: '',
      whats_new: '',
      apk_file: '',
      featured: false,
    });
    setIsUploadModalOpen(true);
  };

  const handleOpenEdit = (app: AppModel) => {
    setEditingApp(app);
    setFormData({
      app_name: app.app_name,
      package_name: app.package_name,
      developer_name: app.developer_name,
      category: app.category,
      version: app.version,
      file_size: app.file_size,
      rating: app.rating,
      description: app.description,
      whats_new: app.whats_new || '',
      apk_file: app.apk_file,
      featured: !!app.featured,
    });
    setIsUploadModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.app_name.trim() || !formData.developer_name.trim()) return;

    const packageName = formData.package_name.trim() || 
      `com.hadi88.${formData.app_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    if (editingApp) {
      const updated: AppModel = {
        ...editingApp,
        app_name: formData.app_name,
        package_name: packageName,
        developer_name: formData.developer_name,
        category: formData.category,
        version: formData.version,
        file_size: formData.file_size,
        rating: Number(formData.rating),
        description: formData.description,
        whats_new: formData.whats_new,
        featured: formData.featured,
        updated_at: new Date().toISOString(),
      };
      onUpdateApp(updated);
    } else {
      const newApp: AppModel = {
        id: `app-${Date.now()}`,
        app_name: formData.app_name,
        package_name: packageName,
        developer_name: formData.developer_name,
        category: formData.category,
        app_icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
        description: formData.description || 'Modern mobile application built by Hadi88 engineering.',
        whats_new: formData.whats_new || 'Initial stable release on Hadi88 Apps Store.',
        version: formData.version || '1.0.0',
        apk_file: formData.apk_file || `${packageName}-v${formData.version || '1.0.0'}.apk`,
        file_size: formData.file_size || '35 MB',
        downloads_count: 0,
        rating: Number(formData.rating) || 4.5,
        reviews_count: 0,
        screenshots: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        featured: formData.featured,
      };
      onAddApp(newApp);
    }

    setIsUploadModalOpen(false);
  };

  const confirmDelete = () => {
    if (deletingAppId) {
      onDeleteApp(deletingAppId);
      setDeletingAppId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in">
      
      {/* Top Header Card */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Hadi88 Apps Administration</span>
          </div>
          <h1 className="text-lg sm:text-3xl font-display font-extrabold text-white mt-0.5">
            Admin Management Dashboard
          </h1>
          <p className="text-[10px] sm:text-xs text-stone-300 mt-0.5">
            Publish packages, monitor metrics, and manage custom app client demands.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Publish App</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl glass-panel text-stone-300 hover:text-white text-[11px] sm:text-xs font-semibold"
          >
            Exit
          </button>
        </div>
      </div>

      {/* KPI Stats Grid (Compact on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        
        <div className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Downloads</span>
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
          </div>
          <div className="text-base sm:text-2xl font-display font-bold text-amber-400 font-mono tabular-nums mt-1">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="text-[8px] sm:text-[10px] text-stone-500 mt-0.5">Total installs</div>
        </div>

        <div className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Inventory</span>
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
          </div>
          <div className="text-base sm:text-2xl font-display font-bold text-white font-mono tabular-nums mt-1">
            {apps.length}
          </div>
          <div className="text-[8px] sm:text-[10px] text-stone-500 mt-0.5">Live applications</div>
        </div>

        <div className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Demands</span>
            <MessageSquarePlus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
          </div>
          <div className="text-base sm:text-2xl font-display font-bold text-amber-400 font-mono tabular-nums mt-1">
            {demands.length}
          </div>
          <div className="text-[8px] sm:text-[10px] text-stone-500 mt-0.5">
            {demands.filter(d => d.status === 'Pending').length} pending review
          </div>
        </div>

        <div className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Store Rating</span>
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-base sm:text-2xl font-display font-bold text-white font-mono tabular-nums mt-1">
            ★ {avgRating}
          </div>
          <div className="text-[8px] sm:text-[10px] text-stone-500 mt-0.5">Global average</div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-amber-500/20 pb-1">
        <button
          onClick={() => setActiveTab('apps')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'apps'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-amber-500/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Apps ({apps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('demands')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'demands'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-amber-500/10'
          }`}
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>Demands ({demands.length})</span>
          {demands.filter(d => d.status === 'Pending').length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* TAB 1: APPLICATIONS INVENTORY */}
      {activeTab === 'apps' && (
        <div className="space-y-3">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-500/15">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400/70" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search app or package..."
                className="w-full bg-[#18120e] text-xs text-white placeholder-stone-400 rounded-lg pl-9 pr-3 py-1.5 border border-amber-500/20 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] sm:text-xs text-stone-400 whitespace-nowrap">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#18120e] text-[10px] sm:text-xs text-stone-200 rounded-lg px-2.5 py-1.5 border border-amber-500/20 focus:outline-none focus:border-amber-400 w-full sm:w-auto"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* MOBILE VIEW: Responsive App Cards (No horizontal scroll required!) */}
          <div className="sm:hidden space-y-2">
            {filteredApps.map((app) => (
              <div 
                key={app.id} 
                className="glass-panel rounded-xl p-3 border border-amber-500/15 flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={app.app_icon}
                    alt={app.app_name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover bg-stone-900 border border-amber-500/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <button
                      onClick={() => onSelectApp(app)}
                      className="font-bold text-white text-xs hover:text-amber-400 truncate text-left block"
                    >
                      {app.app_name}
                    </button>
                    <div className="text-[10px] text-stone-400 truncate mt-0.5">
                      {app.category} · v{app.version}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-stone-400 mt-0.5">
                      <span className="text-amber-400 font-bold">★ {app.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span className="font-mono text-stone-300">{app.downloads_count.toLocaleString()} dl</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(app)}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-400 transition-colors"
                    aria-label="Edit app"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingAppId(app.id)}
                    className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                    aria-label="Delete app"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP / TABLET VIEW: Full Data Table */}
          <div className="hidden sm:block glass-panel rounded-2xl overflow-hidden border border-amber-500/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18120e]/90 text-stone-400 uppercase tracking-wider border-b border-amber-500/15">
                  <tr>
                    <th className="px-4 py-3">Application</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Version</th>
                    <th className="px-4 py-3">Downloads</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-amber-500/5 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.app_icon}
                            alt={app.app_name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-lg object-cover bg-stone-900 border border-amber-500/20 shrink-0"
                          />
                          <div className="min-w-0">
                            <button
                              onClick={() => onSelectApp(app)}
                              className="font-bold text-white text-xs hover:text-amber-400 truncate text-left block"
                            >
                              {app.app_name}
                            </button>
                            <div className="font-mono text-[10px] text-stone-400 truncate">
                              {app.package_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-stone-300">
                        {app.category}
                      </td>
                      <td className="px-4 py-3 font-mono text-stone-300">
                        v{app.version}
                      </td>
                      <td className="px-4 py-3 font-mono text-amber-400 font-semibold tabular-nums">
                        {app.downloads_count.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-bold text-amber-400">
                        ★ {app.rating.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-400 transition-colors"
                          title="Edit App Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingAppId(app.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-stone-400 text-xs">
                        No applications matched your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CLIENT APP DEMANDS & REQUIREMENTS */}
      {activeTab === 'demands' && (
        <div className="space-y-3">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 glass-panel rounded-xl sm:rounded-2xl p-3 border border-amber-500/15">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>Inbound App Demands</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  {demands.length}
                </span>
              </h2>
              <p className="text-[10px] text-stone-400">
                Submitted via "Ask For Your Dreaming App" form.
              </p>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[10px] sm:text-xs text-stone-400">Status:</span>
              <select
                value={demandStatusFilter}
                onChange={(e) => setDemandStatusFilter(e.target.value)}
                className="bg-[#18120e] text-[10px] sm:text-xs text-stone-200 rounded-lg px-2.5 py-1.5 border border-amber-500/20 focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="In Development">In Development</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Demands List */}
          <div className="space-y-2">
            {filteredDemands.map((demand) => (
              <div 
                key={demand.id}
                className="glass-panel rounded-xl p-3 border border-amber-500/15 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-amber-500/10 pb-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-white">{demand.appTitle}</h3>
                      <span className="text-[8px] sm:text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
                        {demand.platform}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-stone-400">
                        {demand.category}
                      </span>
                    </div>
                    <div className="text-[9px] sm:text-xs text-stone-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-stone-300 font-semibold">{demand.userName}</span>
                      <span>·</span>
                      <span className="text-amber-400/90">{demand.contactMethod}: {demand.contactHandle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <select
                      value={demand.status}
                      onChange={(e) => onUpdateDemandStatus(demand.id, e.target.value as AppDemandRequest['status'])}
                      className="bg-[#18120e] text-[9px] sm:text-[11px] font-bold text-amber-300 rounded-lg px-2 py-1 border border-amber-500/25 focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Review">In Review</option>
                      <option value="Approved">Approved</option>
                      <option value="In Development">In Development</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => onDeleteDemand(demand.id)}
                      className="p-1 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                      title="Delete demand"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[10px] sm:text-xs text-stone-300 leading-relaxed whitespace-pre-line">
                  {demand.requirements}
                </p>

                <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-stone-400 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span>Timeline: <strong className="text-white">{demand.timeline}</strong></span>
                    <span>·</span>
                    <span>Budget: <strong className="text-amber-300">{demand.budget}</strong></span>
                  </div>
                  <div>{new Date(demand.submittedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}

            {filteredDemands.length === 0 && (
              <div className="text-center py-8 glass-panel rounded-xl space-y-1">
                <MessageSquarePlus className="w-5 h-5 text-stone-600 mx-auto" />
                <div className="text-xs font-bold text-stone-300">No demands found</div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Publish / Edit Modal Form (Fully responsive for mobile screens) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-fade-in">
          <div className="bg-[#140e0b] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-3.5">
            
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-2.5">
              <div>
                <h2 className="text-sm sm:text-lg font-display font-bold text-white">
                  {editingApp ? `Edit: ${editingApp.app_name}` : 'Publish New App'}
                </h2>
                <p className="text-[10px] text-stone-400">
                  Hadi88 Apps mobile architecture.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg glass-panel text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                    App Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.app_name}
                    onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
                    placeholder="e.g. Zenith Workflow"
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                    Developer *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.developer_name}
                    onChange={(e) => setFormData({ ...formData, developer_name: e.target.value })}
                    placeholder="e.g. Hadi88 Studio"
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                    Package Name (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.package_name}
                    onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                    placeholder="e.g. com.hadi88.zenith"
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AppCategory })}
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    placeholder="45 MB"
                    className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-300 mb-0.5">
                  Full Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="App capabilities and description..."
                  className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-500/15">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg glass-panel text-xs text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md"
                >
                  {editingApp ? 'Save' : 'Publish'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAppId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#140e0b] border border-red-500/30 rounded-xl p-4 sm:p-5 max-w-sm w-full space-y-3">
            <h3 className="text-sm font-bold text-white">Delete Application?</h3>
            <p className="text-xs text-stone-300">
              Are you sure you want to remove this app from the store? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingAppId(null)}
                className="px-3 py-1.5 rounded-lg glass-panel text-xs text-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
