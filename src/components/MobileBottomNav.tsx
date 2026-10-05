import React from 'react';
import { Store, MessageSquarePlus, LayoutDashboard, Code2 } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: 'store' | 'admin' | 'django-code';
  setActiveView: (view: 'store' | 'admin' | 'django-code') => void;
  onOpenDemandModal: () => void;
  pendingDemandsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  setActiveView,
  onOpenDemandModal,
  pendingDemandsCount,
}) => {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#120e0b]/95 backdrop-blur-xl border-t border-amber-500/20 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Tab 1: Storefront */}
        <button
          onClick={() => {
            setActiveView('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'store'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${activeView === 'store' ? 'bg-amber-500/15' : ''}`}>
            <Store className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Store</span>
        </button>

        {/* Tab 2: Ask for App (Demand modal highlight) */}
        <button
          onClick={onOpenDemandModal}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all group"
        >
          <div className="p-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/30 group-active:scale-95 transition-transform">
            <MessageSquarePlus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px] text-amber-300 font-bold mt-0.5 tracking-tight">Ask App</span>
        </button>

        {/* Tab 3: Admin */}
        <button
          onClick={() => {
            setActiveView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'admin'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${activeView === 'admin' ? 'bg-amber-500/15' : ''}`}>
            <LayoutDashboard className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Admin</span>
          {pendingDemandsCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        {/* Tab 4: Django Code */}
        <button
          onClick={() => {
            setActiveView('django-code');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'django-code'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${activeView === 'django-code' ? 'bg-amber-500/15' : ''}`}>
            <Code2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Django</span>
        </button>

      </div>
    </nav>
  );
};
