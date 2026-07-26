import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeRecord, QRType, QRStatus, QRContentType } from '../../types';
import { QRDetailModal } from './QRDetailModal';
import QRCodeStyling from 'qr-code-styling';
import jsPDF from 'jspdf';
import {
  Search,
  Filter,
  PlusCircle,
  BarChart3,
  Edit,
  Copy,
  Trash2,
  Download,
  PlayCircle,
  PauseCircle,
  ExternalLink,
  Calendar,
  Layers,
  ArrowUpDown,
  RefreshCw,
  Zap,
  Globe,
  FileCode,
  FileImage,
  Printer
} from 'lucide-react';
import { ContentTypeIconMap } from '../generator/ContentTypeForms';

export const DashboardPage: React.FC = () => {
  const { records, isLoading, refreshRecords, setCurrentTab, setSelectedAnalyticsQrId, handleUpdateRecord, handleDeleteRecord, handleDuplicateRecord, addToast, triggerPrint } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | QRType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | QRStatus>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | QRContentType>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'scans' | 'name'>('newest');

  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<QRCodeRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const openDetail = (record: QRCodeRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleToggleStatus = async (record: QRCodeRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: QRStatus = record.status === 'active' ? 'paused' : 'active';
    await handleUpdateRecord(record.id, { status: nextStatus });
  };

  // DOWNLOAD PNG ALWAYS USES EXACT DESTINATION URL / USER DATA
  const handleQuickDownloadPNG = (record: QRCodeRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const exactContent = record.destinationUrl || record.staticContent || 'https://qrstudio.app';
    const qr = new QRCodeStyling({
      width: 400,
      height: 400,
      data: exactContent,
      margin: record.customizationJson?.margin || 10,
      dotsOptions: { color: record.customizationJson?.dotsColor || '#000', type: record.customizationJson?.dotsStyle || 'square' },
      backgroundOptions: { color: record.customizationJson?.bgColor || '#fff' },
      cornersSquareOptions: {
        color: record.customizationJson?.cornerSquareColor || record.customizationJson?.dotsColor || '#000000',
        type: record.customizationJson?.cornerSquareStyle || 'square',
      },
      cornersDotOptions: {
        color: record.customizationJson?.cornerDotColor || record.customizationJson?.cornerSquareColor || '#000000',
        type: record.customizationJson?.cornerDotStyle || 'square',
      },
      image: record.customizationJson?.logoUrl || undefined,
      imageOptions: {
        imageSize: record.customizationJson?.logoSizeRatio || 0.2,
        margin: 4,
      }
    });
    qr.download({ name: `${record.qrName.replace(/[^a-z0-9]/gi, '_')}_qr`, extension: 'png' });
    addToast('Downloaded PNG for exact target URL', 'success');
  };

  const handleGoToAnalytics = (record: QRCodeRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAnalyticsQrId(record.id);
    setCurrentTab('analytics');
  };

  // Filtering Logic
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.qrName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.destinationUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.staticContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.campaign && r.campaign.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || r.qrType === typeFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesContentType = contentTypeFilter === 'all' || r.contentType === contentTypeFilter;

    return matchesSearch && matchesType && matchesStatus && matchesContentType;
  });

  // Sorting Logic
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'scans') return (b.totalScans || 0) - (a.totalScans || 0);
    if (sortBy === 'name') return a.qrName.localeCompare(b.qrName);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* PAGE TITLE & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 light:border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white light:text-slate-900 font-sans tracking-tight">
            Campaign Dashboard
          </h1>
          <p className="text-sm text-slate-400 light:text-slate-600 mt-1">
            Search, filter, edit target links, and download exact QR codes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshRecords()}
            className="p-2.5 rounded-xl bg-navy-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-300 light:text-slate-700 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            title="Refresh records from Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setCurrentTab('generator')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-600 to-glow-purple text-white font-bold text-xs shadow-lg shadow-electric-600/30 flex items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New QR</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="p-5 rounded-3xl bg-navy-900/70 light:bg-white border border-slate-800 light:border-slate-200 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by QR name, destination URL, campaign, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-xs"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs focus:outline-none focus:border-electric-500"
            >
              <option value="all">All QR Types</option>
              <option value="dynamic">Tracked QR</option>
              <option value="static">Direct QR</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs focus:outline-none focus:border-electric-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="paused">Paused Only</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs focus:outline-none focus:border-electric-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="scans">Sort: Most Scanned</option>
              <option value="name">Sort: Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* QR CARDS LIST / TABLE */}
      {sortedRecords.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-navy-900/40 light:bg-slate-50 border border-slate-800/80 light:border-slate-200 space-y-4 max-w-md mx-auto">
          <div className="p-4 rounded-full bg-slate-800/60 text-slate-400 w-fit mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white light:text-slate-900">No QR Records Found</h3>
          <p className="text-xs text-slate-400">
            {searchTerm || typeFilter !== 'all' ? 'Try adjusting your search query or filters.' : 'Create your first QR code to start tracking campaign metrics.'}
          </p>
          <button
            onClick={() => setCurrentTab('generator')}
            className="px-6 py-2.5 rounded-xl bg-electric-600 text-white text-xs font-bold shadow-lg"
          >
            Create First QR Code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRecords.map((r) => {
            const ContentIcon = ContentTypeIconMap[r.contentType]?.icon || Globe;
            const targetUrl = r.destinationUrl || r.staticContent;

            return (
              <div
                key={r.id}
                onClick={() => openDetail(r)}
                className="group relative p-6 rounded-3xl bg-navy-900/80 light:bg-white border border-slate-800 light:border-slate-200 hover:border-electric-500/60 light:hover:border-electric-500 shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                {/* TOP HEADER BAR */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-electric-500/10 text-electric-400 shrink-0">
                      <ContentIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white light:text-slate-900 group-hover:text-electric-400 transition-colors line-clamp-1">
                        {r.qrName}
                      </h3>
                      <p className="text-[11px] text-slate-400 capitalize">{r.contentType} • {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    r.qrType === 'dynamic' ? 'bg-electric-500/20 text-electric-300 border border-electric-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {r.qrType}
                  </span>
                </div>

                {/* DESTINATION PREVIEW */}
                <div className="p-3 rounded-xl bg-navy-950 light:bg-slate-50 border border-slate-800/80 light:border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Target Data / URL</span>
                  <p className="text-xs font-mono text-slate-300 light:text-slate-700 truncate">{targetUrl || 'Not specified'}</p>
                </div>

                {/* METRICS & STATUS BAR */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 light:border-slate-200 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white light:text-slate-900 flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5 text-electric-400" />
                      <span>{r.totalScans || 0} scans</span>
                    </span>

                    <button
                      onClick={(e) => handleToggleStatus(r, e)}
                      className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider ${
                        r.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {r.status}
                    </button>
                  </div>

                  {/* QUICK ACTIONS */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleQuickDownloadPNG(r, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Download PNG for exact QR data"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleGoToAnalytics(r, e)}
                      className="p-1.5 rounded-lg text-electric-400 hover:bg-electric-500/20 transition-colors"
                      title="View Analytics"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      <QRDetailModal
        record={selectedRecord}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

    </div>
  );
};
