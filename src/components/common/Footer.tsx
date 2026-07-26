import React from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Shield, Heart, ExternalLink, Database } from 'lucide-react';
import { APP_NAME, DESIGNER_CREDIT } from '../../config/appConfig';

export const Footer: React.FC = () => {
  const { setCurrentTab } = useApp();

  return (
    <footer className="border-t border-slate-800/80 bg-navy-950 text-slate-400 light:bg-slate-50 light:border-slate-200 light:text-slate-600 transition-colors py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand & Credit Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-electric-600 text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white light:text-slate-900 font-sans">{APP_NAME}</span>
          </div>
          <p className="text-sm text-slate-400 light:text-slate-600 max-w-md leading-relaxed">
            Professional QR Code Generator & Dynamic Redirect Analytics. Craft custom branded QR codes with high-res PNG, SVG & PDF export, backed by Google Sheets.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900 light:bg-slate-200 border border-slate-800 light:border-slate-300 text-xs text-slate-300 light:text-slate-700 font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{DESIGNER_CREDIT}</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white light:text-slate-900 uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => setCurrentTab('landing')} className="hover:text-electric-400 transition-colors">
                Home / Overview
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('generator')} className="hover:text-electric-400 transition-colors">
                Create QR Code
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('dashboard')} className="hover:text-electric-400 transition-colors">
                Campaign Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('analytics')} className="hover:text-electric-400 transition-colors">
                Analytics Reports
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('settings')} className="hover:text-electric-400 transition-colors">
                Google Sheets Setup
              </button>
            </li>
          </ul>
        </div>

        {/* Quota & Technical Notice */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white light:text-slate-900 uppercase tracking-wider">Architecture Note</h4>
          <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
            <Database className="w-3.5 h-3.5 inline mr-1 text-electric-400" />
            Dynamic QR redirects use Google Apps Script. Standard Google quotas apply (~20k requests/day). All scan metrics are stored directly inside your private Google Sheet.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Privacy Friendly</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/60 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 light:text-slate-600 gap-4">
        <p>© {new Date().getFullYear()} {APP_NAME}. {DESIGNER_CREDIT}. All rights reserved.</p>
        <p className="text-slate-500">Built with React, TypeScript, Tailwind & Google Apps Script API.</p>
      </div>
    </footer>
  );
};
