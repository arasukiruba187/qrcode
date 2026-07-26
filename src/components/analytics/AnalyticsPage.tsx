import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchAnalytics } from '../../services/apiService';
import { AnalyticsSummary, QRCodeRecord } from '../../types';
import {
  BarChart3,
  Users,
  Smartphone,
  Globe2,
  Calendar,
  Download,
  ShieldAlert,
  Clock,
  Filter,
  Monitor,
  RefreshCw,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { records, selectedAnalyticsQrId, setSelectedAnalyticsQrId, addToast } = useApp();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dynamicRecords = records.filter((r) => r.qrType === 'dynamic');

  const loadData = async (qrId?: string) => {
    setIsLoading(true);
    try {
      const data = await fetchAnalytics(qrId);
      setAnalytics(data);
    } catch (err) {
      addToast('Error fetching analytics report', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedAnalyticsQrId || undefined);
  }, [selectedAnalyticsQrId]);

  const handleExportCSV = () => {
    if (!analytics || !analytics.recentLogs || analytics.recentLogs.length === 0) {
      addToast('No log data available to export.', 'info');
      return;
    }

    const headers = ['Scan ID', 'QR ID', 'Timestamp', 'Visitor ID', 'Device', 'OS', 'Browser', 'Referrer', 'Redirect URL'];
    const csvRows = [headers.join(',')];

    analytics.recentLogs.forEach((log) => {
      const row = [
        log.scanId,
        log.qrId,
        `"${log.timestamp}"`,
        log.visitorId,
        log.deviceType,
        log.operatingSystem,
        log.browser,
        `"${log.referrer || ''}"`,
        `"${log.redirectUrl || ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `analytics_${analytics.qrId}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Analytics report exported as CSV', 'success');
  };

  const activeRecord = selectedAnalyticsQrId ? records.find(r => r.id === selectedAnalyticsQrId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER & QR SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 light:border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white light:text-slate-900 font-sans tracking-tight">
            Dynamic QR Analytics
          </h1>
          <p className="text-sm text-slate-400 light:text-slate-600 mt-1">
            Track scan volume, unique visitor estimates, operating systems, and traffic sources in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* QR Selector Dropdown */}
          <select
            value={selectedAnalyticsQrId || 'all'}
            onChange={(e) => setSelectedAnalyticsQrId(e.target.value === 'all' ? null : e.target.value)}
            className="p-2.5 rounded-xl bg-navy-900 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs font-semibold focus:outline-none focus:border-electric-500"
          >
            <option value="all">All Dynamic QR Codes</option>
            {dynamicRecords.map((r) => (
              <option key={r.id} value={r.id}>
                {r.qrName} ({r.totalScans} scans)
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* PRIVACY & APPROXIMATION NOTICE */}
      <div className="p-4 rounded-2xl bg-navy-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-xs text-slate-400 light:text-slate-600 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
        <p>
          <strong>Privacy Notice:</strong> Analytics (unique visitors, device type, OS) are parsed from user-agent headers and anonymized visitor IDs. Exact geolocation may be approximate due to browser privacy controls.
        </p>
      </div>

      {/* SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Scans Card */}
        <div className="p-6 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Scans</span>
            <div className="p-2.5 rounded-xl bg-electric-500/10 text-electric-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white light:text-slate-900 font-sans">
            {isLoading ? '...' : (analytics?.totalScans || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Lifetime total scans</span>
          </p>
        </div>

        {/* Unique Visitors */}
        <div className="p-6 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Unique Visitors</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white light:text-slate-900 font-sans">
            {isLoading ? '...' : (analytics?.uniqueVisitors || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-purple-400 font-medium">Anonymized device sessions</p>
        </div>

        {/* Top Device */}
        <div className="p-6 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Device</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white light:text-slate-900 font-sans">
            {isLoading ? '...' : (Object.keys(analytics?.devices || {}).sort((a, b) => (analytics?.devices[b] || 0) - (analytics?.devices[a] || 0))[0] || 'Mobile')}
          </p>
          <p className="text-[11px] text-cyan-400 font-medium">Primary traffic source</p>
        </div>

        {/* Top OS */}
        <div className="p-6 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Platform</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Monitor className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white light:text-slate-900 font-sans">
            {isLoading ? '...' : (Object.keys(analytics?.operatingSystems || {}).sort((a, b) => (analytics?.operatingSystems[b] || 0) - (analytics?.operatingSystems[a] || 0))[0] || 'iOS')}
          </p>
          <p className="text-[11px] text-amber-400 font-medium">Leading operating system</p>
        </div>
      </div>

      {/* TIMELINE CHART & BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SCANS TIMELINE TABLE/BARS (7 COLS) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider font-sans">
            Scan Activity Timeline (Past 14 Days)
          </h3>

          {analytics?.scansByDate ? (
            <div className="space-y-3">
              {Object.entries(analytics.scansByDate).map(([date, count]) => {
                const maxCount = Math.max(...Object.values(analytics.scansByDate), 1);
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={date} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-300 light:text-slate-700 font-mono">
                      <span>{date}</span>
                      <span className="font-bold text-white light:text-slate-900">{count} scans</span>
                    </div>
                    <div className="w-full bg-slate-800 light:bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-electric-500 to-glow-purple h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No date timeline data recorded yet.</p>
          )}
        </div>

        {/* DEVICE & OS BREAKDOWN CARDS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Device Category Breakdown */}
          <div className="p-6 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider font-sans">
              Device Category
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics?.devices || {}).map(([dev, count]) => (
                <div key={dev} className="flex items-center justify-between p-3 rounded-xl bg-navy-950 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                  <span className="text-xs font-semibold text-slate-200 light:text-slate-800">{dev}</span>
                  <span className="text-xs font-mono font-bold text-electric-400">{count} scans</span>
                </div>
              ))}
            </div>
          </div>

          {/* OS Breakdown */}
          <div className="p-6 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider font-sans">
              Operating System
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics?.operatingSystems || {}).map(([os, count]) => (
                <div key={os} className="flex items-center justify-between p-3 rounded-xl bg-navy-950 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                  <span className="text-xs font-semibold text-slate-200 light:text-slate-800">{os}</span>
                  <span className="text-xs font-mono font-bold text-purple-400">{count} scans</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* RECENT SCAN LOGS TABLE */}
      <div className="p-6 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider font-sans">
          Recent Live Scan Activity Log
        </h3>

        {analytics?.recentLogs && analytics.recentLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 light:border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">OS</th>
                  <th className="py-3 px-4">Browser</th>
                  <th className="py-3 px-4">Visitor ID</th>
                  <th className="py-3 px-4">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 light:divide-slate-200 text-slate-300 light:text-slate-700">
                {analytics.recentLogs.map((log) => (
                  <tr key={log.scanId} className="hover:bg-slate-800/30 light:hover:bg-slate-100 transition-colors">
                    <td className="py-3 px-4 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4 font-medium text-white light:text-slate-900">{log.deviceType}</td>
                    <td className="py-3 px-4">{log.operatingSystem}</td>
                    <td className="py-3 px-4">{log.browser}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{log.visitorId.substring(0, 12)}</td>
                    <td className="py-3 px-4 truncate max-w-xs">{log.referrer || 'Direct Scan'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No scan activity recorded yet.</p>
        )}
      </div>

    </div>
  );
};
