import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Download, Layers, Star, 
  X, Shield, MessageSquarePlus, Clock 
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
        app_icon: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(formData.app_name)}&backgroundColor=1f150f`,
        banner_image: undefined,
        description: formData.description || `Built by Hadi88 Apps on demand. High-performance ${formData.category} application.`,
        version: formData.version || '1.0.0',
        apk_file: formData.apk_file || `${packageName}_v${formData.version}.apk`,
        file_size: formData.file_size || '35 MB',
        downloads_count: 0,
        rating: Number(formData.rating) || 4.5,
        reviews_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        whats_new: formData.whats_new || 'Initial public release from Hadi88 Apps.',
        screenshots: [],
        featured: formData.featured,
      };
      onAddApp(newApp);
    }

    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-amber-500/20">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Hadi88 Apps · Admin Management</span>
          </div>
          <h1 className="text-lg sm:text-3xl font-display font-extrabold text-white mt-0.5">
            Store & Demand Control
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
            "We are building app on your demand" — Review client demands & manage apps.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition-all hover:scale-102"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Publish App (APK)</span>
        </button>
      </div>

      {/* KPI Stats Grid (Compact on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        
        <div className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Downloads</span>
            <Download className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-3xl font-display font-bold text-amber-400 font-mono tabular-nums mt-1 sm:mt-2">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="text-[9px] sm:text-[11px] text-stone-500 mt-0.5">Across all packages</div>
        </div>

        <div className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Apps</span>
            <Layers className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-3xl font-display font-bold text-white font-mono tabular-nums mt-1 sm:mt-2">
            {apps.length}
          </div>
          <div className="text-[9px] sm:text-[11px] text-stone-500 mt-0.5">Catalog inventory</div>
        </div>

        <div className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Demands</span>
            <MessageSquarePlus className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-3xl font-display font-bold text-amber-400 font-mono tabular-nums mt-1 sm:mt-2">
            {demands.length}
          </div>
          <div className="text-[9px] sm:text-[11px] text-stone-500 mt-0.5">
            {demands.filter(d => d.status === 'Pending').length} pending review
          </div>
        </div>

        <div className="glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Rating</span>
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-lg sm:text-3xl font-display font-bold text-white font-mono tabular-nums mt-1 sm:mt-2">
            ★ {avgRating}
          </div>
          <div className="text-[9px] sm:text-[11px] text-stone-500 mt-0.5">Store average</div>
        </div>

      </div>

      {/* Tabs: Application Inventory vs Client On-Demand Requests */}
      <div className="flex items-center gap-1.5 border-b border-amber-500/20 pb-1">
        <button
          onClick={() => setActiveTab('apps')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 ${
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
          className={`px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 ${
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 glass-panel rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-amber-500/15">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400/70" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search app or package..."
                className="w-full bg-[#18120e] text-xs text-white placeholder-stone-400 rounded-lg sm:rounded-xl pl-9 pr-3 py-1.5 sm:py-2 border border-amber-500/20 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] text-stone-400 whitespace-nowrap">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#18120e] text-[11px] sm:text-xs text-stone-200 rounded-lg sm:rounded-xl px-2.5 py-1.5 border border-amber-500/20 focus:outline-none focus:border-amber-400 w-full sm:w-auto"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table (Responsive horizontal scroll with compact text) */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-amber-500/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] sm:text-xs min-w-[560px]">
                <thead className="bg-[#18120e]/90 text-stone-400 uppercase tracking-wider border-b border-amber-500/15">
                  <tr>
                    <th className="px-3 sm:px-6 py-2.5 sm:py-3.5">Application</th>
                    <th className="px-3 sm:px-6 py-2.5 sm:py-3.5">Category</th>
                    <th className="px-3 sm:px-6 py-2.5 sm:py-3.5">Version</th>
                    <th className="px-3 sm:px-6 py-2.5 sm:py-3.5">Downloads</th>
                    <th className="px-3 sm:px-6 py-2.5 sm:py-3.5">Rating</th>
                    <th className="px-3 sm:px-6 py-2.5 sm:py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-amber-500/5 transition-colors group">
                      <td className="px-3 sm:px-6 py-2.5 sm:py-3.5">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={app.app_icon}
                            alt={app.app_name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg object-cover bg-stone-900 border border-amber-500/20 shrink-0"
                          />
                          <div className="min-w-0">
                            <button
                              onClick={() => onSelectApp(app)}
                              className="font-bold text-white text-xs sm:text-sm hover:text-amber-400 truncate text-left block"
                            >
                              {app.app_name}
                            </button>
                            <div className="font-mono text-[10px] text-stone-400 truncate">
                              {app.package_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-2.5 sm:py-3.5 text-stone-300">
                        {app.category}
                      </td>
                      <td className="px-3 sm:px-6 py-2.5 sm:py-3.5 font-mono text-stone-300">
                        v{app.version}
                      </td>
                      <td className="px-3 sm:px-6 py-2.5 sm:py-3.5 font-mono text-amber-400 font-semibold tabular-nums">
                        {app.downloads_count.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-2.5 sm:py-3.5 font-bold text-amber-400">
                        ★ {app.rating.toFixed(1)}
                      </td>
                      <td className="px-3 sm:px-6 py-2.5 sm:py-3.5 text-right space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-400 transition-colors"
                          title="Edit App Details"
                        >
                          <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingAppId(app.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-amber-500/15">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>Inbound App Demands</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  {demands.length}
                </span>
              </h2>
              <p className="text-[10px] sm:text-[11px] text-stone-400">
                Submitted via "Ask For Your Dreaming App" form.
              </p>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[10px] sm:text-xs text-stone-400">Status:</span>
              <select
                value={demandStatusFilter}
                onChange={(e) => setDemandStatusFilter(e.target.value)}
                className="bg-[#18120e] text-[10px] sm:text-xs text-stone-200 rounded-lg sm:rounded-xl px-2.5 py-1.5 border border-amber-500/20 focus:outline-none focus:border-amber-400"
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
          <div className="space-y-2.5">
            {filteredDemands.map((demand) => (
              <div 
                key={demand.id}
                className="glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-amber-500/15 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-amber-500/10 pb-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{demand.appTitle}</h3>
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
                        {demand.platform}
                      </span>
                      <span className="text-[9px] text-stone-400">
                        {demand.category}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-stone-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-stone-300 font-semibold">{demand.userName}</span>
                      <span>·</span>
                      <span className="text-amber-400/90">{demand.contactMethod}: {demand.contactHandle}</span>
                      <span>·</span>
                      <span>{new Date(demand.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={demand.status}
                      onChange={(e) => onUpdateDemandStatus(demand.id, e.target.value as any)}
                      className="text-[10px] sm:text-xs font-bold rounded-lg px-2 py-1 bg-stone-900 text-amber-400 border border-amber-500/30"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Review">In Review</option>
                      <option value="Approved">Approved</option>
                      <option value="In Development">In Development</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => onDeleteDemand(demand.id)}
                      className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                      title="Delete Request"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Requirements Text */}
                <div className="text-[11px] sm:text-xs text-stone-300 bg-[#160f0b] p-2.5 rounded-lg border border-amber-500/10 whitespace-pre-line leading-relaxed">
                  <div className="text-[9px] uppercase font-bold text-stone-500 mb-0.5">Client Requirements:</div>
                  {demand.requirements}
                </div>

                {/* Timeline & Budget badges */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-stone-400 pt-0.5">
                  {demand.timeline && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Timeline: <strong className="text-stone-200">{demand.timeline}</strong></span>
                    </div>
                  )}
                  {demand.budget && (
                    <div>
                      <span>Budget: <strong className="text-stone-200">{demand.budget}</strong></span>
                    </div>
                  )}
                </div>

              </div>
            ))}

            {filteredDemands.length === 0 && (
              <div className="text-center py-10 glass-panel rounded-2xl space-y-1">
                <MessageSquarePlus className="w-6 h-6 text-stone-600 mx-auto" />
                <div className="text-xs font-bold text-stone-300">No demands found</div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Publish / Edit Modal Form */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-[#140e0b] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 space-y-4">
            
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
              <div>
                <h2 className="text-base sm:text-xl font-display font-bold text-white">
                  {editingApp ? `Edit: ${editingApp.app_name}` : 'Publish New App'}
                </h2>
                <p className="text-[10px] sm:text-xs text-stone-400">
                  Hadi88 Apps mobile architecture.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg glass-panel text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                    Application Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.app_name}
                    onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
                    placeholder="e.g. Zenith Workflow"
                    className="w-full glass-input rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                    Developer *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.developer_name}
                    onChange={(e) => setFormData({ ...formData, developer_name: e.target.value })}
                    placeholder="e.g. Hadi88 Studio"
                    className="w-full glass-input rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                    Package Name (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.package_name}
                    onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                    placeholder="e.g. com.hadi88.zenith"
                    className="w-full glass-input rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AppCategory })}
                    className="w-full glass-input rounded-lg px-3 py-1.5 text-xs text-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                    className="w-full glass-input rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    placeholder="45 MB"
                    className="w-full glass-input rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="App capabilities and description..."
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
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

      {/* Delete App Confirmation Modal */}
      {deletingAppId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-[#160f0b] border border-red-500/30 rounded-xl p-4 max-w-sm w-full space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white">Delete Application?</h3>
            <p className="text-[11px] text-stone-400">
              Remove this app and all associated stats from the store?
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDeletingAppId(null)}
                className="px-3 py-1 rounded-lg glass-panel text-xs text-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteApp(deletingAppId);
                  setDeletingAppId(null);
                }}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
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
