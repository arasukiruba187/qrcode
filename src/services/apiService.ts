import { QRCodeRecord } from '../types';
import { DEFAULT_FALLBACK_APPS_SCRIPT_URL, DEFAULT_APPS_SCRIPT_URL_KEY, DEFAULT_LOCAL_STORAGE_KEY } from '../config/appConfig';

/**
 * Helper to get currently configured Apps Script Web App URL
 */
export function getAppsScriptUrl(): string {
  const customUrl = localStorage.getItem(DEFAULT_APPS_SCRIPT_URL_KEY);
  if (customUrl && customUrl.trim() !== '') {
    return customUrl.trim();
  }
  return DEFAULT_FALLBACK_APPS_SCRIPT_URL;
}

/**
 * Helper to set Apps Script Web App URL
 */
export function setAppsScriptUrl(url?: string): void {
  if (url && url.trim() !== '') {
    localStorage.setItem(DEFAULT_APPS_SCRIPT_URL_KEY, url.trim());
  } else {
    localStorage.removeItem(DEFAULT_APPS_SCRIPT_URL_KEY);
  }
}

export const saveAppsScriptUrl = setAppsScriptUrl;

/**
 * Local Storage Fallback Cache Management
 */
export function getLocalRecords(): QRCodeRecord[] {
  try {
    const raw = localStorage.getItem(DEFAULT_LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading local QR records:', e);
  }
  return [];
}

export function saveLocalRecords(records: QRCodeRecord[]): void {
  try {
    localStorage.setItem(DEFAULT_LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving local QR records:', e);
  }
}

/**
 * Check Backend Health
 */
export async function checkAppsScriptHealth(url?: string): Promise<{ success: boolean; message: string }> {
  const targetUrl = url || getAppsScriptUrl();
  if (!targetUrl) {
    return { success: false, message: 'Google Apps Script Web App URL is not configured.' };
  }

  try {
    const res = await fetch(`${targetUrl}?action=health`, { method: 'GET', mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'ok') {
        return { success: true, message: 'Connected to Google Apps Script Web App successfully!' };
      }
    }
    return { success: false, message: `Server responded with status ${res.status}.` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network request failed.' };
  }
}

export const checkBackendHealth = checkAppsScriptHealth;

/**
 * Fetch all QR records
 */
export async function fetchQRCodes(): Promise<QRCodeRecord[]> {
  const scriptUrl = getAppsScriptUrl();
  if (!scriptUrl) {
    return getLocalRecords();
  }

  try {
    const res = await fetch(`${scriptUrl}?action=getQRCodes`, { method: 'GET', mode: 'cors' });
    if (res.ok) {
      const result = await res.json();
      if (result && result.status === 'success' && Array.isArray(result.data)) {
        const parsed: QRCodeRecord[] = result.data.map((item: any) => ({
          ...item,
          tags: typeof item.tags === 'string' ? item.tags.split(',').filter(Boolean) : (item.tags || []),
          customizationJson: typeof item.customizationJson === 'string' ? JSON.parse(item.customizationJson) : item.customizationJson,
          totalScans: Number(item.totalScans || 0)
        }));
        saveLocalRecords(parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Apps Script fetch failed, using local cache fallback', err);
  }

  return getLocalRecords();
}

/**
 * Fetch Analytics overview
 */
export async function fetchAnalytics(qrId?: string): Promise<any> {
  const records = getLocalRecords();
  const targetRecords = qrId ? records.filter(r => r.id === qrId) : records;
  const totalScans = targetRecords.reduce((acc, r) => acc + (r.totalScans || 0), 0);

  return {
    totalScans,
    uniqueVisitors: totalScans,
    scansByDate: {},
    devices: {},
    browsers: {},
    operatingSystems: {},
    recentLogs: []
  };
}

/**
 * Create a new QR Code record with ultra-compact ID for simple minimal 21x21 QR grid
 */
export async function createQRCode(record: Omit<QRCodeRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalScans'>): Promise<QRCodeRecord> {
  // 5-character ultra short ID to keep QR code matrix minimal and clean
  const newId = 'q' + Date.now().toString(36).slice(-4);
  const now = new Date().toISOString();
  const scriptUrl = getAppsScriptUrl();

  const shortRedirectUrl = record.qrType === 'dynamic'
    ? (scriptUrl ? `${scriptUrl}?action=redirect&id=${newId}` : `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=redirect&id=${newId}`)
    : '';

  const fullRecord: QRCodeRecord = {
    ...record,
    id: newId,
    shortRedirectUrl: shortRedirectUrl || record.shortRedirectUrl,
    createdAt: now,
    updatedAt: now,
    totalScans: 0,
    createdBy: record.createdBy || 'Arasukirubanandhan'
  };

  // Try Apps Script API
  if (scriptUrl) {
    try {
      const payload = {
        action: 'createQR',
        ...fullRecord
      };
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Apps Script create call failed, saving to local cache', err);
    }
  }

  // Update Local Cache
  const existing = getLocalRecords();
  const updated = [fullRecord, ...existing];
  saveLocalRecords(updated);

  return fullRecord;
}

/**
 * Update an existing QR Code record
 */
export async function updateQRCode(id: string, updates: Partial<QRCodeRecord>): Promise<QRCodeRecord> {
  const existing = getLocalRecords();
  const index = existing.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Record not found');
  }

  const updatedRecord: QRCodeRecord = {
    ...existing[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  existing[index] = updatedRecord;
  saveLocalRecords(existing);

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      const payload = {
        action: 'updateQR',
        id,
        ...updates
      };
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Apps Script update call failed', err);
    }
  }

  return updatedRecord;
}

/**
 * Delete a QR Code record
 */
export async function deleteQRCode(id: string): Promise<boolean> {
  const existing = getLocalRecords();
  const filtered = existing.filter(r => r.id !== id);
  saveLocalRecords(filtered);

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      const payload = { action: 'deleteQR', id };
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Apps Script delete call failed', err);
    }
  }

  return true;
}

/**
 * Duplicate a QR Code record
 */
export async function duplicateQRCode(id: string): Promise<QRCodeRecord> {
  const existing = getLocalRecords();
  const target = existing.find(r => r.id === id);
  if (!target) {
    throw new Error('Original record not found for duplication');
  }

  const copyPayload: Omit<QRCodeRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalScans'> = {
    qrName: `${target.qrName} (Copy)`,
    qrType: target.qrType,
    contentType: target.contentType,
    staticContent: target.staticContent,
    destinationUrl: target.destinationUrl,
    shortRedirectUrl: '',
    status: target.status,
    expiresAt: target.expiresAt,
    scanLimit: target.scanLimit,
    campaign: target.campaign,
    tags: target.tags ? [...target.tags] : [],
    customizationJson: { ...target.customizationJson },
    createdBy: 'Arasukirubanandhan'
  };

  return createQRCode(copyPayload);
}
