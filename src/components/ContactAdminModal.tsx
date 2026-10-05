import React, { useState } from 'react';
import { 
  X, Send, Sparkles, ShieldAlert, CheckCircle2, 
  Smartphone 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppCategory, AppDemandRequest } from '../types/app';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDemand: (demand: AppDemandRequest) => void;
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

export const ContactAdminModal: React.FC<ContactAdminModalProps> = ({
  isOpen,
  onClose,
  onSubmitDemand,
}) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [contactMethod, setContactMethod] = useState<'Email' | 'WhatsApp' | 'Telegram'>('Email');
  const [contactHandle, setContactHandle] = useState('');
  const [appTitle, setAppTitle] = useState('');
  const [platform, setPlatform] = useState<'Android' | 'iOS' | 'Cross-Platform' | 'Web App'>('Android');
  const [category, setCategory] = useState<AppCategory>('Productivity');
  const [requirements, setRequirements] = useState('');
  const [timeline, setTimeline] = useState('2-4 Weeks');
  const [budget, setBudget] = useState('$1,000 - $3,000');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !email.trim() || !appTitle.trim() || !requirements.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, App Title, and Requirements).');
      return;
    }
    if (!agreedToPolicy) {
      setErrorMsg('You must review and agree to our Legal Compliance & Safety Policy.');
      return;
    }

    const demand: AppDemandRequest = {
      id: `demand-${Date.now()}`,
      userName: userName.trim(),
      email: email.trim(),
      contactMethod,
      contactHandle: contactHandle.trim() || email.trim(),
      appTitle: appTitle.trim(),
      platform,
      category,
      requirements: requirements.trim(),
      timeline,
      budget,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    onSubmitDemand(demand);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#10b981']
      });
    } catch {
      // Ignore
    }

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#140e0b] border border-amber-500/25 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Modal Header (Compact) */}
        <div className="sticky top-0 z-20 bg-[#140e0b]/95 backdrop-blur-md px-3.5 sm:px-7 py-3 sm:py-4 border-b border-amber-500/15 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Hadi88 Apps · On-Demand Engineering</span>
            </div>
            <h2 className="text-base sm:text-xl font-display font-extrabold text-white">
              Ask For Your Dreaming App
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg glass-panel text-stone-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {submitted ? (
          <div className="p-6 sm:p-12 text-center space-y-3 my-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-2xl font-display font-bold text-white">
              Application Demand Submitted!
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-amber-400">{userName}</strong>. Our engineering leads at <strong className="text-white">Hadi88 Apps</strong> have received your custom project request for <strong className="text-amber-300">"{appTitle}"</strong>. We will review your requirements and reach out via {contactMethod}.
            </p>
          </div>
        ) : (
          /* Form Content with Scrolling */
          <form onSubmit={handleSubmit} className="p-3.5 sm:p-7 space-y-3.5 sm:space-y-5 overflow-y-auto">
            
            {/* Tagline Banner */}
            <div className="glass-panel p-2.5 sm:p-3.5 rounded-xl border border-amber-500/20 text-[11px] sm:text-xs text-amber-200/90 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-300">"We are building app on your demand"</span> — Share your vision.
              </div>
            </div>

            {/* MANDATORY WARNING / LEGAL COMPLIANCE BOX (Compact on mobile) */}
            <div className="rounded-xl sm:rounded-2xl bg-red-950/30 border border-red-500/40 p-3 sm:p-4 space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1.5 font-bold text-red-300 uppercase tracking-wide text-[10px]">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Strict Policy Notice</span>
              </div>
              <p className="text-red-200/90 leading-relaxed font-medium">
                <strong>We do not build any illegal, pirated, modded, gambling, adult, hacking, or theft category applications.</strong> In such cases, we will <strong>never reply to spam emails, fraudulent messages, or illicit solicitations</strong>. Our decision is final.
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-300">
                {errorMsg}
              </div>
            )}

            {/* User Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  Preferred Contact
                </label>
                <select
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value as any)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  Phone / Username Handle
                </label>
                <input
                  type="text"
                  value={contactHandle}
                  onChange={(e) => setContactHandle(e.target.value)}
                  placeholder={contactMethod === 'WhatsApp' ? '+1 234 567 8900' : contactMethod === 'Telegram' ? '@handle' : 'email'}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* App Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1.5 border-t border-amber-500/10">
              <div className="sm:col-span-1">
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  App Concept Name *
                </label>
                <input
                  type="text"
                  required
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="e.g. Nova Tracker"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Android">Android (APK)</option>
                  <option value="iOS">iOS (Swift)</option>
                  <option value="Cross-Platform">Cross-Platform (Flutter / RN)</option>
                  <option value="Web App">Web Application / PWA</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AppCategory)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Requirements Textarea */}
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                App Requirements & Features *
              </label>
              <textarea
                required
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe your dreaming app: What problem does it solve? Key screens, authentication, offline syncing, or APIs required..."
                className="w-full glass-input rounded-xl p-2.5 text-xs text-white leading-relaxed placeholder-stone-500"
              />
            </div>

            {/* Timeline & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="1-2 Weeks (Urgent MVP)">1-2 Weeks (Urgent MVP)</option>
                  <option value="2-4 Weeks">2-4 Weeks</option>
                  <option value="1-2 Months">1-2 Months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-300 mb-1">
                  Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Under $1,000">Under $1,000</option>
                  <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                  <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                  <option value="$5,000+">$5,000+</option>
                </select>
              </div>
            </div>

            {/* Policy Checkbox */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#1a120d] border border-amber-500/20 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="policy-checkbox"
                required
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded accent-amber-500 cursor-pointer"
              />
              <label htmlFor="policy-checkbox" className="text-[10px] sm:text-xs text-stone-300 cursor-pointer leading-relaxed">
                I confirm my app contains no illegal, pirated, or theft material, and I accept Hadi88 Apps safety standards.
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 pt-2 border-t border-amber-500/15">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl glass-panel text-[11px] sm:text-xs text-stone-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-102"
              >
                <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                <span>Submit App Request</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
