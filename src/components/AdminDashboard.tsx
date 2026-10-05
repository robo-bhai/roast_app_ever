import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, ArrowUpRight, BarChart3, 
  Download, Layers, Star, HardDrive, Check, X, Shield, 
  UploadCloud, MessageSquarePlus, Clock, Mail, CheckCircle2, ShieldAlert 
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
  const [deletingDemandId, setDeletingDemandId] = useState<string | null>(null);
  const [inspectingDemand, setInspectingDemand] = useState<AppDemandRequest | null>(null);

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

  // Calculate store stats
  const totalDownloads = apps.reduce((acc, a) => acc + a.downloads_count, 0);
  const avgRating = apps.length > 0
    ? (apps.reduce((acc, a) => acc + a.rating, 0) / apps.length).toFixed(2)
    : '0.00';
  const categoriesCount = new Set(apps.map(a => a.category)).size;

  // Filter apps in table
  const filteredApps = apps.filter(app => {
    const matchesSearch = 
      app.app_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.developer_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.package_name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter demands
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-3xl p-5 sm:p-7 border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Hadi88 Apps · Admin Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Store & Demand Control Center
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            "We are building app on your demand" — Review custom client inquiries, publish APK packages, and track stats.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-102 min-h-[44px]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Publish New App (APK)</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Downloads</span>
            <Download className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-amber-400 font-mono tabular-nums mt-1.5 sm:mt-2">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="text-[10px] sm:text-[11px] text-stone-500 mt-1">Across all packages</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Live Apps</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white font-mono tabular-nums mt-1.5 sm:mt-2">
            {apps.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-stone-500 mt-1">Catalog inventory</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Client Demands</span>
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-amber-400 font-mono tabular-nums mt-1.5 sm:mt-2">
            {demands.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-stone-500 mt-1">
            {demands.filter(d => d.status === 'Pending').length} pending review
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider">Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white font-mono tabular-nums mt-1.5 sm:mt-2">
            ★ {avgRating}
          </div>
          <div className="text-[10px] sm:text-[11px] text-stone-500 mt-1">Average store rating</div>
        </div>

      </div>

      {/* Tabs: Application Inventory vs Client On-Demand Requests */}
      <div className="flex items-center gap-2 border-b border-amber-500/20 pb-1">
        <button
          onClick={() => setActiveTab('apps')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 min-h-[44px] ${
            activeTab === 'apps'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-stone-300 hover:text-white hover:bg-amber-500/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Application Inventory ({apps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('demands')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 min-h-[44px] ${
            activeTab === 'demands'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-stone-300 hover:text-white hover:bg-amber-500/10'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Client App Demands ({demands.length})</span>
          {demands.filter(d => d.status === 'Pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* TAB 1: APPLICATIONS INVENTORY */}
      {activeTab === 'apps' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel rounded-2xl p-4 border border-amber-500/15">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/70" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search app or package..."
                className="w-full bg-[#18120e] text-xs text-white placeholder-stone-400 rounded-xl pl-10 pr-4 py-2.5 border border-amber-500/20 focus:outline-none focus:border-amber-400 min-h-[44px]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-stone-400 whitespace-nowrap">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#18120e] text-xs text-stone-200 rounded-xl px-3 py-2 border border-amber-500/20 focus:outline-none focus:border-amber-400 min-h-[44px] w-full sm:w-auto"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-amber-500/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[640px]">
                <thead className="bg-[#18120e]/90 text-stone-400 uppercase tracking-wider border-b border-amber-500/15">
                  <tr>
                    <th className="px-6 py-4">Application</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Version</th>
                    <th className="px-6 py-4">Downloads</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-amber-500/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.app_icon}
                            alt={app.app_name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover bg-stone-900 border border-amber-500/20 shrink-0"
                          />
                          <div className="min-w-0">
                            <button
                              onClick={() => onSelectApp(app)}
                              className="font-bold text-white text-sm hover:text-amber-400 truncate text-left block"
                            >
                              {app.app_name}
                            </button>
                            <div className="font-mono text-[11px] text-stone-400 truncate mt-0.5">
                              {app.package_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-stone-300">
                        {app.category}
                      </td>
                      <td className="px-6 py-4 font-mono text-stone-300">
                        v{app.version}
                      </td>
                      <td className="px-6 py-4 font-mono text-amber-400 font-semibold tabular-nums">
                        {app.downloads_count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-amber-400">
                        ★ {app.rating.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="p-2 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-400 transition-colors min-h-[36px] min-w-[36px] inline-flex items-center justify-center"
                          title="Edit App Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingAppId(app.id)}
                          className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors min-h-[36px] min-w-[36px] inline-flex items-center justify-center"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
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
        <div className="space-y-4">
          
          {/* Header & Status Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel rounded-2xl p-4 border border-amber-500/15">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Inbound App Demands</span>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {demands.length} submitted
                </span>
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Submitted via "Ask For Your Dreaming App" contact form.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-stone-400">Filter Status:</span>
              <select
                value={demandStatusFilter}
                onChange={(e) => setDemandStatusFilter(e.target.value)}
                className="bg-[#18120e] text-xs text-stone-200 rounded-xl px-3 py-2 border border-amber-500/20 focus:outline-none focus:border-amber-400 min-h-[44px]"
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
          <div className="space-y-3">
            {filteredDemands.map((demand) => (
              <div 
                key={demand.id}
                className="glass-panel rounded-2xl p-5 border border-amber-500/15 space-y-3 transition-all hover:border-amber-500/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{demand.appTitle}</h3>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
                        {demand.platform}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {demand.category}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="text-stone-300 font-semibold">{demand.userName}</span>
                      <span>·</span>
                      <span className="text-amber-400/90">{demand.contactMethod}: {demand.contactHandle}</span>
                      <span>·</span>
                      <span>{new Date(demand.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div className="flex items-center gap-2">
                    <select
                      value={demand.status}
                      onChange={(e) => onUpdateDemandStatus(demand.id, e.target.value as any)}
                      className={`text-xs font-bold rounded-xl px-3 py-2 border focus:outline-none transition-colors ${
                        demand.status === 'Approved' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' :
                        demand.status === 'In Development' ? 'bg-amber-950/60 text-amber-400 border-amber-500/40' :
                        demand.status === 'In Review' ? 'bg-blue-950/60 text-blue-400 border-blue-500/40' :
                        demand.status === 'Rejected' ? 'bg-red-950/60 text-red-400 border-red-500/40' :
                        'bg-stone-900 text-stone-300 border-stone-700'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Review">In Review</option>
                      <option value="Approved">Approved</option>
                      <option value="In Development">In Development</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => onDeleteDemand(demand.id)}
                      className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                      title="Delete Request"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Requirements Text */}
                <div className="text-xs text-stone-300 bg-[#160f0b] p-3.5 rounded-xl border border-amber-500/10 whitespace-pre-line leading-relaxed">
                  <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">Client Specifications:</div>
                  {demand.requirements}
                </div>

                {/* Timeline & Budget badges */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 pt-1">
                  {demand.timeline && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Timeline: <strong className="text-stone-200">{demand.timeline}</strong></span>
                    </div>
                  )}
                  {demand.budget && (
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Budget: <strong className="text-stone-200">{demand.budget}</strong></span>
                    </div>
                  )}
                </div>

              </div>
            ))}

            {filteredDemands.length === 0 && (
              <div className="text-center py-16 glass-panel rounded-3xl space-y-2">
                <MessageSquarePlus className="w-8 h-8 text-stone-600 mx-auto" />
                <div className="text-sm font-bold text-stone-300">No client demands in this category</div>
                <p className="text-xs text-stone-500">
                  When visitors submit custom app requests, they appear here instantly.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Publish / Edit Modal Form */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#140e0b] border border-amber-500/30 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-8 space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  {editingApp ? `Edit: ${editingApp.app_name}` : 'Publish New Application'}
                </h2>
                <p className="text-xs text-stone-400">
                  Hadi88 Apps distribution architecture.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-xl glass-panel text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Application Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.app_name}
                    onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
                    placeholder="e.g. Zenith Workflow"
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Developer / Studio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.developer_name}
                    onChange={(e) => setFormData({ ...formData, developer_name: e.target.value })}
                    placeholder="e.g. Hadi88 Studio"
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Package Name (SlugField)
                  </label>
                  <input
                    type="text"
                    value={formData.package_name}
                    onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                    placeholder="e.g. com.hadi88.zenith"
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AppCategory })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white min-h-[44px]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Version (SemVer)
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    File Size (Display)
                  </label>
                  <input
                    type="text"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    placeholder="45 MB"
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Initial Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    APK Package File
                  </label>
                  <input
                    type="text"
                    value={formData.apk_file}
                    onChange={(e) => setFormData({ ...formData, apk_file: e.target.value })}
                    placeholder="appname_v1.0.0.apk"
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono min-h-[44px]"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed breakdown of application architecture and capabilities..."
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Release Notes / What's New
                </label>
                <textarea
                  rows={2}
                  value={formData.whats_new}
                  onChange={(e) => setFormData({ ...formData, whats_new: e.target.value })}
                  placeholder="• Fixed memory leaks&#10;• Added dark mode support"
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="featured-checkbox" className="text-xs text-stone-300">
                  Showcase in Hero Featured Spotlight
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-500/15">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl glass-panel text-xs text-stone-300 hover:text-white min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 min-h-[44px]"
                >
                  {editingApp ? 'Save Changes' : 'Publish Application'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete App Confirmation Modal */}
      {deletingAppId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#160f0b] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Application?</h3>
            <p className="text-xs text-stone-400">
              Are you sure you want to delete this app from the store? This will immediately remove the APK package and all associated stats.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingAppId(null)}
                className="px-3 py-1.5 rounded-xl glass-panel text-xs text-stone-300 hover:text-white min-h-[40px]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteApp(deletingAppId);
                  setDeletingAppId(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs min-h-[40px]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
