import React from 'react';
import { ContentTypeFormData, QRContentType } from '../../types';
import {
  Globe,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Wifi,
  UserCheck,
  MapPin,
  Calendar,
  CreditCard,
  Share2,
  Smartphone,
  FileDown
} from 'lucide-react';

interface ContentTypeFormsProps {
  contentType: QRContentType;
  formData: ContentTypeFormData;
  onChange: (updated: Partial<ContentTypeFormData>) => void;
}

export const ContentTypeIconMap: Record<QRContentType, { label: string; icon: React.FC<{ className?: string }> }> = {
  url: { label: 'Website URL', icon: Globe },
  text: { label: 'Plain Text', icon: FileText },
  email: { label: 'Email', icon: Mail },
  phone: { label: 'Phone Call', icon: Phone },
  sms: { label: 'SMS', icon: MessageSquare },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle },
  wifi: { label: 'Wi-Fi Network', icon: Wifi },
  vcard: { label: 'vCard Contact', icon: UserCheck },
  location: { label: 'Google Maps', icon: MapPin },
  event: { label: 'Event / iCal', icon: Calendar },
  upi: { label: 'UPI Payment', icon: CreditCard },
  social: { label: 'Social Profile', icon: Share2 },
  app_download: { label: 'App Stores', icon: Smartphone },
  file_link: { label: 'PDF / File', icon: FileDown },
};

export const ContentTypeForms: React.FC<ContentTypeFormsProps> = ({
  contentType,
  formData,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onChange({ [name]: checked });
    } else {
      onChange({ [name]: value });
    }
  };

  switch (contentType) {
    case 'url':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Target Website URL
            </label>
            <div className="relative">
              <Globe className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="url"
                name="url"
                value={formData.url || ''}
                onChange={handleChange}
                placeholder="https://yourwebsite.com/landing-page"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Enter the full web address where users will land when scanning.</p>
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Text Message / Note
            </label>
            <textarea
              name="text"
              rows={4}
              value={formData.text || ''}
              onChange={handleChange}
              placeholder="Enter plain text, promotional promo code, or instructions..."
              className="w-full p-4 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
        </div>
      );

    case 'email':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Recipient Email Address *
            </label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress || ''}
              onChange={handleChange}
              placeholder="support@company.com"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Preset Email Subject
            </label>
            <input
              type="text"
              name="emailSubject"
              value={formData.emailSubject || ''}
              onChange={handleChange}
              placeholder="Inquiry regarding services"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Preset Message Body
            </label>
            <textarea
              name="emailBody"
              rows={3}
              value={formData.emailBody || ''}
              onChange={handleChange}
              placeholder="Hi Team, I am interested in learning more..."
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
        </div>
      );

    case 'phone':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Phone Number (with Country Code)
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                placeholder="+1 555 123 4567"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Scanning will prompt user's phone dialer automatically.</p>
          </div>
        </div>
      );

    case 'sms':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Recipient Phone Number *
            </label>
            <input
              type="tel"
              name="smsPhone"
              value={formData.smsPhone || ''}
              onChange={handleChange}
              placeholder="+1 555 987 6543"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Pre-written SMS Message
            </label>
            <textarea
              name="smsMessage"
              rows={3}
              value={formData.smsMessage || ''}
              onChange={handleChange}
              placeholder="JOIN PROMO 2026"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
        </div>
      );

    case 'whatsapp':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              WhatsApp Number (with Country Code) *
            </label>
            <input
              type="tel"
              name="waPhone"
              value={formData.waPhone || ''}
              onChange={handleChange}
              placeholder="15551234567"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Pre-filled WhatsApp Message
            </label>
            <textarea
              name="waMessage"
              rows={3}
              value={formData.waMessage || ''}
              onChange={handleChange}
              placeholder="Hello! I saw your QR code and would like more details."
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
        </div>
      );

    case 'wifi':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Network Name (SSID) *
            </label>
            <input
              type="text"
              name="wifiSsid"
              value={formData.wifiSsid || ''}
              onChange={handleChange}
              placeholder="MyHome_WiFi"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="text"
                name="wifiPassword"
                value={formData.wifiPassword || ''}
                onChange={handleChange}
                placeholder="SecretPassword123"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Encryption Type
              </label>
              <select
                name="wifiEncryption"
                value={formData.wifiEncryption || 'WPA'}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-electric-500 text-sm"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="wifiHidden"
              name="wifiHidden"
              checked={formData.wifiHidden || false}
              onChange={handleChange}
              className="rounded border-slate-700 text-electric-600 focus:ring-electric-500 h-4 w-4"
            />
            <label htmlFor="wifiHidden" className="text-xs text-slate-300 light:text-slate-700">
              Hidden Network (SSID is not broadcast)
            </label>
          </div>
        </div>
      );

    case 'vcard':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="vFirstName"
                value={formData.vFirstName || ''}
                onChange={handleChange}
                placeholder="Alexander"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="vLastName"
                value={formData.vLastName || ''}
                onChange={handleChange}
                placeholder="Wright"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Company / Org
              </label>
              <input
                type="text"
                name="vOrganization"
                value={formData.vOrganization || ''}
                onChange={handleChange}
                placeholder="Acme Innovations"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="vTitle"
                value={formData.vTitle || ''}
                onChange={handleChange}
                placeholder="Managing Director"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Mobile Phone
              </label>
              <input
                type="tel"
                name="vPhoneMobile"
                value={formData.vPhoneMobile || ''}
                onChange={handleChange}
                placeholder="+1 555 321 9876"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="vEmail"
                value={formData.vEmail || ''}
                onChange={handleChange}
                placeholder="alexander@acme.com"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
          </div>
        </div>
      );

    case 'location':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Location Address or Business Name
            </label>
            <input
              type="text"
              name="locationAddress"
              value={formData.locationAddress || ''}
              onChange={handleChange}
              placeholder="1600 Amphitheatre Pkwy, Mountain View, CA"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Latitude (Optional)
              </label>
              <input
                type="text"
                name="locationLat"
                value={formData.locationLat || ''}
                onChange={handleChange}
                placeholder="37.4220"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Longitude (Optional)
              </label>
              <input
                type="text"
                name="locationLng"
                value={formData.locationLng || ''}
                onChange={handleChange}
                placeholder="-122.0841"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
          </div>
        </div>
      );

    case 'event':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="eventTitle"
              value={formData.eventTitle || ''}
              onChange={handleChange}
              placeholder="Global Tech Summit 2026"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Venue / Location
            </label>
            <input
              type="text"
              name="eventLocation"
              value={formData.eventLocation || ''}
              onChange={handleChange}
              placeholder="Convention Hall A, San Francisco"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="eventStart"
                value={formData.eventStart || ''}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="eventEnd"
                value={formData.eventEnd || ''}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
          </div>
        </div>
      );

    case 'upi':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              UPI VPA / ID (e.g., merchant@bank) *
            </label>
            <input
              type="text"
              name="upiVpa"
              value={formData.upiVpa || ''}
              onChange={handleChange}
              placeholder="qrstudio@okaxis"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Payee Name
              </label>
              <input
                type="text"
                name="upiName"
                value={formData.upiName || ''}
                onChange={handleChange}
                placeholder="QR Studio Payments"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Amount (INR ₹, Optional)
              </label>
              <input
                type="number"
                name="upiAmount"
                value={formData.upiAmount || ''}
                onChange={handleChange}
                placeholder="499"
                className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
              />
            </div>
          </div>
        </div>
      );

    case 'social':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Social Profile URL *
            </label>
            <input
              type="url"
              name="socialUrl"
              value={formData.socialUrl || ''}
              onChange={handleChange}
              placeholder="https://instagram.com/yourbrand"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
        </div>
      );

    case 'app_download':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Apple App Store Link
            </label>
            <input
              type="url"
              name="appIosUrl"
              value={formData.appIosUrl || ''}
              onChange={handleChange}
              placeholder="https://apps.apple.com/app/id123456"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Google Play Store Link
            </label>
            <input
              type="url"
              name="appAndroidUrl"
              value={formData.appAndroidUrl || ''}
              onChange={handleChange}
              placeholder="https://play.google.com/store/apps/details?id=com.example.app"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
        </div>
      );

    case 'file_link':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              PDF or File Direct URL *
            </label>
            <input
              type="url"
              name="fileUrl"
              value={formData.fileUrl || ''}
              onChange={handleChange}
              placeholder="https://drive.google.com/uc?id=YOUR_FILE_ID"
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-electric-500 text-sm"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
