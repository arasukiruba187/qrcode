import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getAppsScriptUrl, saveAppsScriptUrl, checkAppsScriptHealth } from '../../services/apiService';
import { Database, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react';
import { DESIGNER_CREDIT } from '../../config/appConfig';

export const SettingsModal: React.FC = () => {
  const { addToast, refreshRecords } = useApp();
  const [scriptUrl, setScriptUrl] = useState<string>(() => getAppsScriptUrl());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveUrl = async () => {
    saveAppsScriptUrl(scriptUrl);
    addToast('Google Apps Script URL saved!', 'success');
    if (scriptUrl.trim()) {
      handleTestConnection();
    }
  };

  const handleTestConnection = async () => {
    if (!scriptUrl.trim()) {
      setTestResult({ success: false, message: 'Please enter a valid Google Apps Script Web App URL.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    const res = await checkAppsScriptHealth(scriptUrl.trim());
    setTestResult(res);
    setIsTesting(false);

    if (res.success) {
      addToast('Apps Script Connection Successful!', 'success');
      refreshRecords();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* PAGE TITLE */}
      <div className="border-b border-slate-800/80 light:border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-white light:text-slate-900 font-sans tracking-tight">
          API & Google Sheets Settings
        </h1>
        <p className="text-sm text-slate-400 light:text-slate-600 mt-1">
          Connect your Google Apps Script Web App URL to enable live Google Sheets synchronization and analytics.
        </p>
      </div>

      {/* WEB APP URL CONFIGURATION CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-6">
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-electric-500/10 text-electric-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white light:text-slate-900">Google Apps Script Web App Endpoint</h3>
            <p className="text-xs text-slate-400">Pasted endpoint must start with https://script.google.com/macros/s/...</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Web App URL
            </label>
            <input
              type="url"
              value={scriptUrl}
              onChange={(e) => setScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full p-4 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 font-mono text-xs focus:outline-none focus:border-electric-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSaveUrl}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <span>Save & Connect</span>
            </button>

            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-800 hover:text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>
          </div>

          {/* Test Feedback Box */}
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
              testResult.success ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              <div>
                <p className="font-bold">{testResult.success ? 'Connected Successfully!' : 'Connection Warning'}</p>
                <p className="mt-0.5">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QUICK SETUP GUIDE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2 font-sans">
          <HelpCircle className="w-5 h-5 text-electric-400" />
          <span>How to setup your Google Sheet in 2 Minutes</span>
        </h3>

        <ol className="space-y-3 text-xs text-slate-300 light:text-slate-700 list-decimal list-inside leading-relaxed">
          <li>Create a new Google Sheet named <strong>"QR Studio Database"</strong>.</li>
          <li>Create 3 sheets named exactly: <code>QRCodes</code>, <code>ScanLogs</code>, and <code>Settings</code>.</li>
          <li>In <code>QRCodes</code> row 1, add headers: <code>id | qrName | qrType | contentType | staticContent | destinationUrl | shortRedirectUrl | status | createdAt | updatedAt | expiresAt | scanLimit | passwordHash | campaign | tags | customizationJson | totalScans | lastScanAt | createdBy</code></li>
          <li>Open <strong>Extensions &gt; Apps Script</strong> and paste the contents of <code>google-apps-script/Code.gs</code>.</li>
          <li>Click <strong>Deploy &gt; New deployment &gt; Select Web app</strong>. Execute as: <strong>Me</strong>, Access: <strong>Anyone</strong>.</li>
          <li>Copy the Web App URL and paste it in the field above!</li>
        </ol>
      </div>

    </div>
  );
};
