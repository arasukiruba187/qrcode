import { QRCodeRecord, QRCustomization, PresetTemplate } from '../types';

export const APP_NAME = "QR Studio";
export const DESIGNER_CREDIT = "Designed by Arasukirubanandhan";

export const DEFAULT_APPS_SCRIPT_URL_KEY = "qr_studio_apps_script_url";
export const DEFAULT_LOCAL_STORAGE_KEY = "qr_studio_records_v1";
export const THEME_KEY = "qr_studio_theme";

// Deployed Google Apps Script Web App URL by Arasukirubanandhan
export const DEFAULT_FALLBACK_APPS_SCRIPT_URL = 
  (import.meta as any).env?.VITE_APPS_SCRIPT_URL || 
  "https://script.google.com/macros/s/AKfycbzmn7OQz1xnXXByB2f9o4oXq4qPrtBJyrSF4eZ4I0vn8H0_RfRl3nSHZnVpvWGRcIYArQ/exec";

// Default configuration for QR customization - Clean minimal square grid
export const DEFAULT_QR_CUSTOMIZATION: QRCustomization = {
  size: 300,
  margin: 10,
  errorCorrectionLevel: 'L',
  dotsStyle: 'square',
  dotsColor: '#000000',
  dotsGradientEnabled: false,
  dotsGradientType: 'linear',
  dotsGradientColor2: '#000000',
  dotsGradientRotation: 45,
  bgColor: '#FFFFFF',
  bgGradientEnabled: false,
  bgGradientColor2: '#FFFFFF',
  cornerSquareStyle: 'square',
  cornerSquareColor: '#000000',
  cornerDotStyle: 'square',
  cornerDotColor: '#000000',
  logoUrl: '',
  logoSizeRatio: 0.2,
  hideBackgroundDotsWithLogo: true,
};

// Preset Templates
export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'classic-minimal',
    name: 'Classic Square Minimal',
    category: 'minimal',
    iconName: 'Zap',
    customization: {
      dotsStyle: 'square',
      dotsColor: '#000000',
      bgColor: '#FFFFFF',
      cornerSquareStyle: 'square',
      cornerSquareColor: '#000000',
      cornerDotStyle: 'square',
      cornerDotColor: '#000000',
      errorCorrectionLevel: 'L'
    }
  },
  {
    id: 'business',
    name: 'Executive Dark',
    category: 'business',
    iconName: 'Briefcase',
    customization: {
      dotsStyle: 'square',
      dotsColor: '#0F172A',
      bgColor: '#FFFFFF',
      cornerSquareStyle: 'square',
      cornerSquareColor: '#0F172A',
      cornerDotStyle: 'square',
      cornerDotColor: '#0F172A',
      errorCorrectionLevel: 'L'
    }
  },
  {
    id: 'restaurant',
    name: 'Gourmet Gold',
    category: 'restaurant',
    iconName: 'Utensils',
    customization: {
      dotsStyle: 'square',
      dotsColor: '#B45309',
      bgColor: '#FFFFFF',
      cornerSquareStyle: 'square',
      cornerSquareColor: '#B45309',
      cornerDotStyle: 'square',
      cornerDotColor: '#B45309',
      errorCorrectionLevel: 'L'
    }
  }
];
