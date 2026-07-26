import { QRCodeRecord, AnalyticsSummary, ScanLog } from '../types';
import {
  DEFAULT_APPS_SCRIPT_URL_KEY,
  DEFAULT_LOCAL_STORAGE_KEY,
  DEFAULT_FALLBACK_APPS_SCRIPT_URL,
  MOCK_QR_RECORDS
} from '../config/appConfig';

/**
 * Get current Google Apps Script Web App URL (reads from localStorage or env variable fallback)
 */
export function getAppsScriptUrl(): string {
  return localStorage.getItem(DEFAULT_APPS_SCRIPT_URL_KEY) || DEFAULT_FALLBACK_APPS_SCRIPT_URL || '';
}

/**
 * Save Google Apps Script Web App URL to localStorage
 */
export function saveAppsScriptUrl(url: string): void {
  localStorage.setItem(DEFAULT_APPS_SCRIPT_URL_KEY, url.trim());
}

/**
 * Helper to get or generate anonymous visitor ID for unique analytics tracking
 */
export function getVisitorId(): string {
  let vid = localStorage.getItem('qr_studio_visitor_id');
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('qr_studio_visitor_id', vid);
  }
  return vid;
}

/**
 * Read local storage cache records
 */
function getLocalRecords(): QRCodeRecord[] {
  try {
    const raw = localStorage.getItem(DEFAULT_LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading local QR storage', e);
  }
  // Initialize with mock records if empty
  localStorage.setItem(DEFAULT_LOCAL_STORAGE_KEY, JSON.stringify(MOCK_QR_RECORDS));
  return MOCK_QR_RECORDS;
}

/**
 * Save records to local storage cache
 */
function saveLocalRecords(records: QRCodeRecord[]): void {
  try {
    localStorage.setItem(DEFAULT_LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving local QR storage', e);
  }
}

/**
 * Test health status of Google Apps Script Web App
 */
export async function checkAppsScriptHealth(url?: string): Promise<{ success: boolean; message: string }> {
  const targetUrl = url || getAppsScriptUrl();
  if (!targetUrl) {
    return { success: false, message: 'Google Apps Script URL is not configured. Running in local mock mode.' };
  }

  try {
    const res = await fetch(`${targetUrl}?action=health`, { method: 'GET', mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'ok') {
        return { success: true, message: 'Successfully connected to Google Apps Script API!' };
      }
    }
    return { success: false, message: 'API returned unexpected status. Verify your Apps Script Web App deployment settings.' };
  } catch (err) {
    return { success: false, message: 'Network request failed. Ensure deployment is set to "Anyone" and CORS is accessible.' };
  }
}

/**
 * Fetch all QR codes (Apps Script with Local Fallback)
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
        // Parse customizationJson if needed
        const parsed: QRCodeRecord[] = result.data.map((item: any) => ({
          ...item,
          tags: typeof item.tags === 'string' ? item.tags.split(',').filter(Boolean) : (item.tags || []),
          customizationJson: typeof item.customizationJson === 'string' ? JSON.parse(item.customizationJson) : item.customizationJson,
          totalScans: Number(item.totalScans || 0)
        }));
        saveLocalRecords(parsed); // Sync local cache
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Apps Script fetch failed, using local cache fallback', err);
  }

  return getLocalRecords();
}

/**
 * Create a new QR Code record
 */
export async function createQRCode(record: Omit<QRCodeRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalScans'>): Promise<QRCodeRecord> {
  const newId = 'qr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
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

  // 1. Try Apps Script API
  if (scriptUrl) {
    try {
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'createQR',
          ...fullRecord,
          customizationJson: fullRecord.customizationJson
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          console.log('Created successfully in Google Sheets');
        }
      }
    } catch (err) {
      console.warn('Google Sheets create failed, saved in local storage', err);
    }
  }

  // 2. Always update local storage
  const current = getLocalRecords();
  const updated = [fullRecord, ...current];
  saveLocalRecords(updated);

  return fullRecord;
}

/**
 * Update an existing QR Code record
 */
export async function updateQRCode(id: string, updates: Partial<QRCodeRecord>): Promise<QRCodeRecord> {
  const current = getLocalRecords();
  const index = current.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('QR Record not found');
  }

  const updatedRecord: QRCodeRecord = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateQR',
          id: id,
          ...updates,
          customizationJson: updates.customizationJson
        })
      });
    } catch (err) {
      console.warn('Apps script update failed, synced locally', err);
    }
  }

  current[index] = updatedRecord;
  saveLocalRecords(current);
  return updatedRecord;
}

/**
 * Delete a QR Code record
 */
export async function deleteQRCode(id: string): Promise<boolean> {
  const current = getLocalRecords();
  const updated = current.filter(r => r.id !== id);

  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'deleteQR', id })
      });
    } catch (err) {
      console.warn('Apps Script delete failed', err);
    }
  }

  saveLocalRecords(updated);
  return true;
}

/**
 * Duplicate a QR Code record
 */
export async function duplicateQRCode(id: string): Promise<QRCodeRecord> {
  const current = getLocalRecords();
  const target = current.find(r => r.id === id);
  if (!target) throw new Error('Target QR code not found');

  const newPayload: Omit<QRCodeRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalScans'> = {
    ...target,
    qrName: `${target.qrName} (Copy)`,
    tags: [...target.tags]
  };

  return createQRCode(newPayload);
}

/**
 * Fetch Analytics Summary
 */
export async function fetchAnalytics(qrId?: string): Promise<AnalyticsSummary> {
  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      const url = qrId ? `${scriptUrl}?action=getAnalytics&id=${qrId}` : `${scriptUrl}?action=getAnalytics`;
      const res = await fetch(url, { method: 'GET', mode: 'cors' });
      if (res.ok) {
        const result = await res.json();
        if (result && result.status === 'success' && result.data) {
          return result.data;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live analytics from Apps Script, using mock generator', err);
    }
  }

  // Fallback Mock Analytics Generator
  const records = getLocalRecords();
  const targetQR = qrId ? records.find(r => r.id === qrId) : null;
  const totalScans = targetQR ? targetQR.totalScans : records.reduce((acc, r) => acc + r.totalScans, 0);

  // Generate synthetic mock log timeline
  const scansByDate: Record<string, number> = {};
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().substring(0, 10);
    scansByDate[dateKey] = Math.floor(Math.random() * (totalScans / 10 + 5));
  }

  const mockLogs: ScanLog[] = Array.from({ length: Math.min(totalScans, 25) }).map((_, idx) => ({
    scanId: `scan_mock_${idx}`,
    qrId: qrId || (records[idx % records.length]?.id || 'qr_demo_001'),
    timestamp: new Date(Date.now() - idx * 3600000 * 4).toISOString(),
    visitorId: `visitor_${Math.floor(Math.random() * 50)}`,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    deviceType: idx % 3 === 0 ? 'Desktop' : (idx % 2 === 0 ? 'Mobile' : 'Tablet'),
    browser: idx % 2 === 0 ? 'Safari' : 'Chrome',
    operatingSystem: idx % 2 === 0 ? 'iOS' : 'Android',
    referrer: idx % 4 === 0 ? 'https://google.com' : (idx % 3 === 0 ? 'Direct Scan' : 'https://t.co'),
    language: 'en-US',
    country: 'United States',
    redirectUrl: targetQR?.destinationUrl || 'https://qrstudio.app'
  }));

  return {
    qrId: qrId || 'all',
    totalScans: totalScans,
    uniqueVisitors: Math.max(1, Math.round(totalScans * 0.72)),
    scansByDate,
    devices: { Mobile: Math.round(totalScans * 0.65), Desktop: Math.round(totalScans * 0.25), Tablet: Math.round(totalScans * 0.10) },
    browsers: { Chrome: Math.round(totalScans * 0.45), Safari: Math.round(totalScans * 0.40), Firefox: Math.round(totalScans * 0.10), Other: Math.round(totalScans * 0.05) },
    operatingSystems: { iOS: Math.round(totalScans * 0.50), Android: Math.round(totalScans * 0.35), macOS: Math.round(totalScans * 0.10), Windows: Math.round(totalScans * 0.05) },
    recentLogs: mockLogs
  };
}
