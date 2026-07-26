import { QRCodeRecord, QRCustomization, PresetTemplate } from '../types';

export const APP_NAME = "QR Studio";
export const DESIGNER_CREDIT = "Designed by Arasukirubanandhan";

export const DEFAULT_APPS_SCRIPT_URL_KEY = "qr_studio_apps_script_url";
export const DEFAULT_LOCAL_STORAGE_KEY = "qr_studio_records_v1";
export const THEME_KEY = "qr_studio_theme";

// Default Web App URL fallback (reads from Vercel env variable VITE_APPS_SCRIPT_URL if set)
export const DEFAULT_FALLBACK_APPS_SCRIPT_URL = (import.meta as any).env?.VITE_APPS_SCRIPT_URL || "";

// Default configuration for QR customization
export const DEFAULT_QR_CUSTOMIZATION: QRCustomization = {
  size: 300,
  margin: 10,
  errorCorrectionLevel: 'M',
  dotsStyle: 'square',
  dotsColor: '#0F172A',
  dotsGradientEnabled: false,
  dotsGradientType: 'linear',
  dotsGradientColor2: '#3B82F6',
  dotsGradientRotation: 45,
  bgColor: '#FFFFFF',
  bgGradientEnabled: false,
  bgGradientColor2: '#F8FAFC',
  cornerSquareStyle: 'square',
  cornerSquareColor: '#0F172A',
  cornerDotStyle: 'square',
  cornerDotColor: '#0F172A',
  logoUrl: '',
  logoSizeRatio: 0.2,
  hideBackgroundDotsWithLogo: true,
};

// Preset Templates
export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'business',
    name: 'Executive Dark',
    category: 'business',
    iconName: 'Briefcase',
    customization: {
      dotsStyle: 'rounded',
      dotsColor: '#0F172A',
      bgColor: '#FFFFFF',
      cornerSquareStyle: 'extra-rounded',
      cornerSquareColor: '#1E293B',
      cornerDotStyle: 'dot',
      cornerDotColor: '#3B82F6',
      errorCorrectionLevel: 'H'
    }
  },
  {
    id: 'restaurant',
    name: 'Gourmet Gold',
    category: 'restaurant',
    iconName: 'Utensils',
    customization: {
      dotsStyle: 'classy',
      dotsColor: '#78350F',
      bgColor: '#FFFBEB',
      cornerSquareStyle: 'extra-rounded',
      cornerSquareColor: '#B45309',
      cornerDotStyle: 'dot',
      cornerDotColor: '#D97706',
      errorCorrectionLevel: 'Q'
    }
  },
  {
    id: 'event',
    name: 'Electric Neon',
    category: 'event',
    iconName: 'Calendar',
    customization: {
      dotsStyle: 'dots',
      dotsColor: '#2563EB',
      dotsGradientEnabled: true,
      dotsGradientType: 'linear',
      dotsGradientColor2: '#8B5CF6',
      bgColor: '#FFFFFF',
      cornerSquareStyle: 'extra-rounded',
      cornerSquareColor: '#1D4ED8',
      cornerDotStyle: 'dot',
      cornerDotColor: '#7C3AED',
      errorCorrectionLevel: 'H'
    }
  },
  {
    id: 'payment',
    name: 'Secure UPI Green',
    category: 'payment',
    iconName: 'CreditCard',
    customization: {
      dotsStyle: 'square',
      dotsColor: '#065F46',
      bgColor: '#F0FDF4',
      cornerSquareStyle: 'square',
      cornerSquareColor: '#047857',
      cornerDotStyle: 'square',
      cornerDotColor: '#10B981',
      errorCorrectionLevel: 'H'
    }
  },
  {
    id: 'wifi',
    name: 'Ocean Cyber',
    category: 'wifi',
    iconName: 'Wifi',
    customization: {
      dotsStyle: 'rounded',
      dotsColor: '#0284C7',
      bgColor: '#F0F9FF',
      cornerSquareStyle: 'extra-rounded',
      cornerSquareColor: '#0369A1',
      cornerDotStyle: 'dot',
      cornerDotColor: '#06B6D4',
      errorCorrectionLevel: 'M'
    }
  },
  {
    id: 'social',
    name: 'Sunset Gradient',
    category: 'social',
    iconName: 'Share2',
    customization: {
      dotsStyle: 'extra-rounded',
      dotsColor: '#DB2777',
      dotsGradientEnabled: true,
      dotsGradientType: 'linear',
      dotsGradientColor2: '#EA580C',
      bgColor: '#FFFFFF',
      cornerSquareStyle: 'extra-rounded',
      cornerSquareColor: '#BE185D',
      cornerDotStyle: 'dot',
      cornerDotColor: '#C2410C',
      errorCorrectionLevel: 'Q'
    }
  }
];

// Mock Demo Data for fallback when Apps Script URL is not set
export const MOCK_QR_RECORDS: QRCodeRecord[] = [
  {
    id: 'qr_demo_001',
    qrName: 'QR Studio Official Site',
    qrType: 'dynamic',
    contentType: 'url',
    staticContent: '',
    destinationUrl: 'https://qrstudio.app',
    shortRedirectUrl: 'https://script.google.com/macros/s/DEMO_ID/exec?action=redirect&id=qr_demo_001',
    status: 'active',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-26T14:30:00Z',
    scanLimit: 5000,
    campaign: 'Product Launch 2026',
    tags: ['SaaS', 'Homepage', 'Official'],
    customizationJson: {
      ...DEFAULT_QR_CUSTOMIZATION,
      dotsStyle: 'rounded',
      dotsColor: '#2563EB',
      cornerSquareStyle: 'extra-rounded',
      cornerSquareColor: '#1D4ED8',
      cornerDotStyle: 'dot',
      cornerDotColor: '#3B82F6'
    },
    totalScans: 1248,
    lastScanAt: '2026-07-26T18:45:12Z',
    createdBy: 'Arasukirubanandhan'
  },
  {
    id: 'qr_demo_002',
    qrName: 'WiFi Guest Access',
    qrType: 'static',
    contentType: 'wifi',
    staticContent: 'WIFI:S:QRStudioGuest;T:WPA;P:Pass12345;;',
    destinationUrl: '',
    shortRedirectUrl: '',
    status: 'active',
    createdAt: '2026-07-22T11:15:00Z',
    updatedAt: '2026-07-22T11:15:00Z',
    campaign: 'Office Infrastructure',
    tags: ['Office', 'Wi-Fi'],
    customizationJson: {
      ...DEFAULT_QR_CUSTOMIZATION,
      dotsStyle: 'square',
      dotsColor: '#0F172A'
    },
    totalScans: 342,
    lastScanAt: '2026-07-26T15:20:00Z',
    createdBy: 'Arasukirubanandhan'
  },
  {
    id: 'qr_demo_003',
    qrName: 'Summer Sale Menu PDF',
    qrType: 'dynamic',
    contentType: 'file_link',
    staticContent: '',
    destinationUrl: 'https://example.com/summer-menu.pdf',
    shortRedirectUrl: 'https://script.google.com/macros/s/DEMO_ID/exec?action=redirect&id=qr_demo_003',
    status: 'active',
    createdAt: '2026-07-24T09:30:00Z',
    updatedAt: '2026-07-25T16:00:00Z',
    expiresAt: '2026-08-31T23:59:59Z',
    campaign: 'Summer Promo',
    tags: ['Restaurant', 'PDF', 'Menu'],
    customizationJson: {
      ...DEFAULT_QR_CUSTOMIZATION,
      dotsStyle: 'classy',
      dotsColor: '#B45309',
      bgColor: '#FFFBEB'
    },
    totalScans: 850,
    lastScanAt: '2026-07-26T21:10:05Z',
    createdBy: 'Arasukirubanandhan'
  },
  {
    id: 'qr_demo_004',
    qrName: 'Store UPI Payment QR',
    qrType: 'static',
    contentType: 'upi',
    staticContent: 'upi://pay?pa=qrstudio@upi&pn=QR%20Studio&cu=INR',
    destinationUrl: '',
    shortRedirectUrl: '',
    status: 'active',
    createdAt: '2026-07-18T14:20:00Z',
    updatedAt: '2026-07-18T14:20:00Z',
    campaign: 'Billing Counter',
    tags: ['Payment', 'UPI'],
    customizationJson: {
      ...DEFAULT_QR_CUSTOMIZATION,
      dotsStyle: 'square',
      dotsColor: '#047857',
      bgColor: '#F0FDF4'
    },
    totalScans: 2190,
    lastScanAt: '2026-07-26T22:05:40Z',
    createdBy: 'Arasukirubanandhan'
  }
];
