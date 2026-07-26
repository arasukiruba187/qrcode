import React, { useState } from 'react';
import { QRCodeRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  ExternalLink,
  Copy,
  BarChart3,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Save,
  Tag,
  Calendar,
  Globe,
  Trash2,
  Copy as DuplicateIcon
} from 'lucide-react';

interface QRDetailModalProps {
  record: QRCodeRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRDetailModal: React.FC<QRDetailModalProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  const { handleUpdateRecord, handleDeleteRecord, handleDuplicateRecord, setSelectedAnalyticsQrId, setCurrentTab, addToast } = useApp();
  const [destinationUrl, setDestinationUrl] = useState<string>('');
  const [qrName, setQrName] = useState<string>('');
  const [status, setStatus] = useState<QRCodeRecord['status']>('active');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  React.useEffect(() => {
    if (record) {
      setDestinationUrl(record.destinationUrl || record.staticContent || '');
      setQrName(record.qrName || '');
      setStatus(record.status || 'active');
    }
  }, [record]);

  if (!record) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await handleUpdateRecord(record.id, {
        qrName,
        destinationUrl: record.qrType === 'dynamic' ? destinationUrl : record.destinationUrl,
        status,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyShortUrl = () => {
    const target = record.shortRedirectUrl || record.destinationUrl || record.staticContent;
    navigator.clipboard.writeText(target);
    addToast('Copied link to clipboard!', 'success');
  };

  const handleViewAnalytics = () => {
    setSelectedAnalyticsQrId(record.id);
    setCurrentTab('analytics');
    onClose();
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${record.qrName}"?`)) {
      await handleDeleteRecord(record.id);
      onClose();
    }
  };

  const handleDuplicate = async () => {
    await handleDuplicateRecord(record.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage: ${record.qrName}`} maxWidth="max-w-3xl">
      <div className="space-y-6">
        
        {/* TOP SUMMARY BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-navy-950 light:bg-slate-100 border border-slate-800 light:border-slate-300">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              record.qrType === 'dynamic' ? 'bg-electric-500/20 text-electric-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {record.qrType}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleViewAnalytics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-electric-600/20 text-electric-300 border border-electric-500/30 hover:bg-electric-600/30 text-xs font-semibold"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics ({record.totalScans} scans)</span>
            </button>

            <button
              onClick={handleDuplicate}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 text-xs"
              title="Duplicate QR"
            >
              <DuplicateIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 text-xs"
              title="Delete QR"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* EDITABLE FIELDS */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
              QR Name
            </label>
            <input
              type="text"
              value={qrName}
              onChange={(e) => setQrName(e.target.value)}
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-sm font-medium focus:outline-none focus:border-electric-500"
            />
          </div>

          {record.qrType === 'dynamic' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                Editable Destination URL
              </label>
              <input
                type="url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://yournewtargeturl.com"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-sm font-mono focus:outline-none focus:border-electric-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Updating this URL changes where existing physical QR prints redirect to instantaneously.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                Static Embedded Content (Read-Only)
              </label>
              <textarea
                readOnly
                value={record.staticContent}
                rows={3}
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-800 text-slate-400 font-mono text-xs cursor-not-allowed"
              />
            </div>
          )}

          {/* Status Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
              Campaign Status
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStatus('active')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-navy-950 text-slate-400 border-slate-800'
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                <span>Active (Redirecting)</span>
              </button>

              <button
                onClick={() => setStatus('paused')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  status === 'paused'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-navy-950 text-slate-400 border-slate-800'
                }`}
              >
                <PauseCircle className="w-4 h-4" />
                <span>Paused (Shows Paused Notice)</span>
              </button>
            </div>
          </div>

          {/* Redirect / Test Link */}
          {record.shortRedirectUrl && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                Encoded Redirect Endpoint
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={record.shortRedirectUrl}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 font-mono text-xs"
                />
                <button
                  onClick={handleCopyShortUrl}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium shrink-0 flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={record.shortRedirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-medium shrink-0 flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 light:border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-navy-950 light:bg-slate-100 text-slate-300 light:text-slate-700 hover:bg-slate-800 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-bold shadow-lg shadow-electric-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
