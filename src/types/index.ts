export type QRType = 'static' | 'dynamic';

export type QRContentType =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'wifi'
  | 'vcard'
  | 'location'
  | 'event'
  | 'upi'
  | 'social'
  | 'app_download'
  | 'file_link';

export type QRStatus = 'active' | 'paused' | 'expired';

export type DotStyleType = 'square' | 'dots' | 'rounded' | 'classy' | 'extra-rounded';
export type CornerSquareStyleType = 'square' | 'dot' | 'extra-rounded';
export type CornerDotStyleType = 'square' | 'dot';

export interface QRCustomization {
  size: number;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  dotsStyle: DotStyleType;
  dotsColor: string;
  dotsGradientEnabled: boolean;
  dotsGradientType: 'linear' | 'radial';
  dotsGradientColor2: string;
  dotsGradientRotation: number;
  bgColor: string;
  bgGradientEnabled: boolean;
  bgGradientColor2: string;
  cornerSquareStyle: CornerSquareStyleType;
  cornerSquareColor: string;
  cornerDotStyle: CornerDotStyleType;
  cornerDotColor: string;
  logoUrl?: string;
  logoSizeRatio: number; // 0.1 to 0.35
  hideBackgroundDotsWithLogo: boolean;
}

export interface QRCodeRecord {
  id: string;
  qrName: string;
  qrType: QRType;
  contentType: QRContentType;
  staticContent: string;
  destinationUrl: string;
  shortRedirectUrl: string;
  status: QRStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  scanLimit?: number;
  passwordHash?: string;
  campaign?: string;
  tags: string[];
  customizationJson: QRCustomization;
  totalScans: number;
  lastScanAt?: string;
  createdBy?: string;
}

export interface ScanLog {
  scanId: string;
  qrId: string;
  timestamp: string;
  visitorId: string;
  userAgent: string;
  deviceType: string;
  browser: string;
  operatingSystem: string;
  referrer: string;
  language: string;
  country: string;
  redirectUrl: string;
}

export interface AnalyticsSummary {
  qrId: string;
  totalScans: number;
  uniqueVisitors: number;
  scansByDate: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
  recentLogs: ScanLog[];
}

export interface PresetTemplate {
  id: string;
  name: string;
  category: string;
  customization: Partial<QRCustomization>;
  iconName: string;
}

// Form state for each content type
export interface ContentTypeFormData {
  // Website
  url: string;
  // Text
  text: string;
  // Email
  emailAddress: string;
  emailSubject: string;
  emailBody: string;
  // Phone
  phoneNumber: string;
  // SMS
  smsPhone: string;
  smsMessage: string;
  // WhatsApp
  waPhone: string;
  waMessage: string;
  // Wi-Fi
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: 'WPA' | 'WEP' | 'nopass';
  wifiHidden: boolean;
  // vCard
  vFirstName: string;
  vLastName: string;
  vOrganization: string;
  vTitle: string;
  vPhoneMobile: string;
  vPhoneWork: string;
  vEmail: string;
  vWebsite: string;
  vStreet: string;
  vCity: string;
  vState: string;
  vZip: string;
  vCountry: string;
  // Location
  locationLat: string;
  locationLng: string;
  locationAddress: string;
  // Event
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  eventStart: string;
  eventEnd: string;
  // UPI Payment
  upiVpa: string;
  upiName: string;
  upiAmount: string;
  upiNote: string;
  // Social links
  socialPlatform: string;
  socialHandle: string;
  socialUrl: string;
  // App Download
  appIosUrl: string;
  appAndroidUrl: string;
  appFallbackUrl: string;
  // File link
  fileUrl: string;
  fileName: string;
}
