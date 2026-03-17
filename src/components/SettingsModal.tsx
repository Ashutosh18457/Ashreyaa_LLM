import React, { useState } from 'react';
import { X, Shield, Bell, Moon, Cpu, Globe, User, Lock, Database, CreditCard, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'Dark' | 'Light' | 'System';
  setTheme: (theme: 'Dark' | 'Light' | 'System') => void;
}

type SettingsTab = 'profile' | 'account' | 'security' | 'appearance' | 'data';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, theme, setTheme }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'account', label: 'Account', icon: <CreditCard size={16} /> },
    { id: 'security', label: 'Security', icon: <Lock size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon size={16} /> },
    { id: 'data', label: 'Data & Privacy', icon: <Database size={16} /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">System Settings</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Configuration & Identity</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-64 border-r border-white/5 p-4 space-y-1 bg-black/20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
                      : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-zinc-900/30">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-black overflow-hidden shadow-2xl">
                          <img src="https://picsum.photos/seed/ashreya/200/200" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 rounded-full border-4 border-zinc-900 flex items-center justify-center text-black">
                          <CheckCircle2 size={14} strokeWidth={3} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Ashutosh Bhule</h3>
                        <p className="text-zinc-400 font-medium">ashutoshbhule1209@gmail.com</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="px-2 py-0.5 bg-teal-500/10 text-teal-500 text-[10px] font-black uppercase tracking-widest rounded border border-teal-500/20">
                            Enterprise Subscriber
                          </span>
                          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded">
                            Verified Node
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Display Name</label>
                        <input type="text" defaultValue="Ashutosh Bhule" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                        <input type="email" defaultValue="ashutoshbhule1209@gmail.com" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Bio / Professional Summary</label>
                      <textarea rows={3} defaultValue="ML Engineer and Aerospace enthusiast. Building the future of neural intelligence." className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all resize-none" />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Theme Engine</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {(['Dark', 'Light', 'System'] as const).map(t => (
                          <button 
                            key={t} 
                            onClick={() => setTheme(t)}
                            className={`p-4 rounded-2xl border transition-all text-center ${theme === t ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300'}`}
                          >
                            <div className={`w-full aspect-video rounded-lg mb-3 ${t === 'Dark' ? 'bg-black' : t === 'Light' ? 'bg-white' : 'bg-gradient-to-br from-black to-white'}`} />
                            <span className="text-xs font-bold">{t}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400">
                            <Bell size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-200">Neural Notifications</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Get alerted when model training completes</p>
                          </div>
                        </div>
                        <div className="w-10 h-5 bg-teal-500 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-6 bg-teal-500/5 border border-teal-500/20 rounded-3xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Lock size={20} className="text-teal-400" />
                        <h3 className="text-sm font-bold text-white">Two-Factor Authentication</h3>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                        Add an extra layer of security to your Ashreya account by requiring a code from your phone in addition to your password.
                      </p>
                      <button className="px-6 py-2 bg-teal-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 transition-all">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Active Sessions</h3>
                      {[
                        { device: 'MacBook Pro 16"', location: 'San Francisco, USA', status: 'Current Session' },
                        { device: 'iPhone 15 Pro', location: 'San Francisco, USA', status: '2 hours ago' }
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400">
                              <Globe size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-zinc-200">{session.device}</p>
                              <p className="text-[10px] text-zinc-500 font-medium">{session.location}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${session.status === 'Current Session' ? 'text-teal-500' : 'text-zinc-600'}`}>
                            {session.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-6 bg-zinc-800/50 rounded-3xl border border-white/5">
                      <h3 className="text-sm font-bold text-white mb-4">Subscription Plan</h3>
                      <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-teal-500/20">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
                            <Cpu size={24} />
                          </div>
                          <div>
                            <p className="text-base font-black text-white">Enterprise Plan</p>
                            <p className="text-xs text-zinc-500 font-medium">Billed monthly • Next renewal: April 16, 2026</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                          Manage
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Payment Methods</h3>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400">
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-200">Visa ending in 4242</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Expires 12/28</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Default</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-zinc-950/50 border-t border-white/5 flex justify-between items-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              Ashreya Neural OS v3.1.4 • Build 2026.03.16
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-8 py-2.5 bg-teal-500 hover:bg-teal-400 text-black text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95"
              >
                Sync Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
