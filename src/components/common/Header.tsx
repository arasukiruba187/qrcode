import React from 'react';
import { useApp, AppTab } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { getAppsScriptUrl } from '../../services/apiService';
import { QrCode, Sun, Moon, LayoutDashboard, BarChart3, PlusCircle, Settings, Home, Sparkles, Database } from 'lucide-react';
import { APP_NAME, DESIGNER_CREDIT } from '../../config/appConfig';

export const Header: React.FC = () => {
  const { currentTab, setCurrentTab, records } = useApp();
  const { theme, toggleTheme } = useTheme();
  const hasAppsScriptUrl = Boolean(getAppsScriptUrl());

  const navItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'generator', label: 'Generator', icon: PlusCircle },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-navy-950/80 backdrop-blur-xl transition-colors dark:bg-navy-950/90 light:bg-white/90 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-electric-600 to-glow-purple text-white shadow-lg shadow-electric-500/20 group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-sans text-white light:text-slate-900">
                  {APP_NAME}
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-electric-500/10 text-electric-400 border border-electric-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 light:text-slate-500 tracking-wide">
                {DESIGNER_CREDIT}
              </p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-navy-900/60 light:bg-slate-100 p-1.5 rounded-2xl border border-slate-800 light:border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-electric-600 text-white shadow-md shadow-electric-600/30'
                      : 'text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900 hover:bg-slate-800/50 light:hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.id === 'dashboard' && records.length > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 light:bg-slate-300 light:text-slate-700'
                    }`}>
                      {records.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: API Status & Theme Toggle */}
          <div className="flex items-center gap-3">
            
            {/* Connection Status Badge */}
            <button
              onClick={() => setCurrentTab('settings')}
              title={hasAppsScriptUrl ? "Connected to Google Sheets API" : "Running in Local Storage Mock Mode"}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                hasAppsScriptUrl
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{hasAppsScriptUrl ? 'Sheets Sync On' : 'Local Cache'}</span>
              <span className={`w-2 h-2 rounded-full animate-pulse ${hasAppsScriptUrl ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </button>

            {/* Quick Action: New QR Button */}
            <button
              onClick={() => setCurrentTab('generator')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-electric-600 to-glow-purple text-white shadow-md hover:opacity-95 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create QR</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light and Dark Mode"
              className="p-2.5 rounded-xl border border-slate-800 light:border-slate-200 text-slate-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 bg-navy-900/60 light:bg-slate-100 hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-800/60 light:border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'text-electric-400 dark:text-electric-400 light:text-electric-600 font-bold'
                    : 'text-slate-400 light:text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
