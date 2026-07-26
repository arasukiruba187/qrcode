import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { QRCodeRecord } from '../types';
import { fetchQRCodes, createQRCode, updateQRCode, deleteQRCode, duplicateQRCode } from '../services/apiService';

export type AppTab = 'landing' | 'generator' | 'dashboard' | 'analytics' | 'settings';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  records: QRCodeRecord[];
  isLoading: boolean;
  refreshRecords: () => Promise<void>;
  selectedAnalyticsQrId: string | null;
  setSelectedAnalyticsQrId: (id: string | null) => void;
  editingRecord: QRCodeRecord | null;
  setEditingRecord: (record: QRCodeRecord | null) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  printRecord: QRCodeRecord | null;
  triggerPrint: (record: QRCodeRecord) => void;
  closePrint: () => void;
  // QR Actions
  handleCreateRecord: (payload: Omit<QRCodeRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalScans'>) => Promise<QRCodeRecord>;
  handleUpdateRecord: (id: string, updates: Partial<QRCodeRecord>) => Promise<QRCodeRecord>;
  handleDeleteRecord: (id: string) => Promise<void>;
  handleDuplicateRecord: (id: string) => Promise<QRCodeRecord>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<AppTab>('landing');
  const [records, setRecords] = useState<QRCodeRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAnalyticsQrId, setSelectedAnalyticsQrId] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<QRCodeRecord | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [printRecord, setPrintRecord] = useState<QRCodeRecord | null>(null);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchQRCodes();
      setRecords(data);
    } catch (err) {
      addToast('Failed to load QR records', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    refreshRecords();
  }, [refreshRecords]);

  const triggerPrint = (record: QRCodeRecord) => {
    setPrintRecord(record);
  };

  const closePrint = () => {
    setPrintRecord(null);
  };

  const handleCreateRecord = async (payload: Omit<QRCodeRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalScans'>) => {
    try {
      const created = await createQRCode(payload);
      setRecords(prev => [created, ...prev]);
      addToast(`QR Code "${created.qrName}" created successfully!`, 'success');
      return created;
    } catch (err) {
      addToast('Error creating QR Code', 'error');
      throw err;
    }
  };

  const handleUpdateRecord = async (id: string, updates: Partial<QRCodeRecord>) => {
    try {
      const updated = await updateQRCode(id, updates);
      setRecords(prev => prev.map(r => r.id === id ? updated : r));
      addToast(`Updated QR code successfully!`, 'success');
      return updated;
    } catch (err) {
      addToast('Error updating QR Code', 'error');
      throw err;
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteQRCode(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      addToast('QR Code deleted', 'info');
    } catch (err) {
      addToast('Error deleting QR Code', 'error');
    }
  };

  const handleDuplicateRecord = async (id: string) => {
    try {
      const duplicated = await duplicateQRCode(id);
      setRecords(prev => [duplicated, ...prev]);
      addToast(`Duplicated QR Code: ${duplicated.qrName}`, 'success');
      return duplicated;
    } catch (err) {
      addToast('Error duplicating QR Code', 'error');
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        records,
        isLoading,
        refreshRecords,
        selectedAnalyticsQrId,
        setSelectedAnalyticsQrId,
        editingRecord,
        setEditingRecord,
        toasts,
        addToast,
        removeToast,
        printRecord,
        triggerPrint,
        closePrint,
        handleCreateRecord,
        handleUpdateRecord,
        handleDeleteRecord,
        handleDuplicateRecord,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
