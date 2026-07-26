import { ContentTypeFormData, QRContentType } from '../types';

/**
 * Formats user inputs into exact target string based on selected QR content type
 */
export function formatQRContent(type: QRContentType, data: Partial<ContentTypeFormData>): string {
  switch (type) {
    case 'url': {
      let url = (data.url || '').trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url || 'https://qrstudio.app';
    }

    case 'text':
      return data.text || 'Welcome to QR Studio!';

    case 'email': {
      const email = (data.emailAddress || '').trim();
      const subject = encodeURIComponent((data.emailSubject || '').trim());
      const body = encodeURIComponent((data.emailBody || '').trim());
      let mailto = `mailto:${email}`;
      const params: string[] = [];
      if (subject) params.push(`subject=${subject}`);
      if (body) params.push(`body=${body}`);
      if (params.length > 0) {
        mailto += '?' + params.join('&');
      }
      return mailto || 'mailto:contact@example.com';
    }

    case 'phone': {
      const phone = (data.phoneNumber || '').trim();
      return phone ? `tel:${phone}` : 'tel:+15551234567';
    }

    case 'sms': {
      const phone = (data.smsPhone || '').trim();
      const msg = (data.smsMessage || '').trim();
      return `smsto:${phone}:${msg}`;
    }

    case 'whatsapp': {
      const cleanPhone = (data.waPhone || '').replace(/[^0-9]/g, '');
      const msg = encodeURIComponent((data.waMessage || '').trim());
      return `https://wa.me/${cleanPhone}?text=${msg}`;
    }

    case 'wifi': {
      const ssid = (data.wifiSsid || 'MyWiFi').replace(/([\\;:,"])/g, '\\$1');
      const pass = (data.wifiPassword || '').replace(/([\\;:,"])/g, '\\$1');
      const enc = data.wifiEncryption || 'WPA';
      const hidden = data.wifiHidden ? 'true' : 'false';
      return `WIFI:S:${ssid};T:${enc};P:${pass};H:${hidden};;`;
    }

    case 'vcard': {
      const fn = `${data.vFirstName || ''} ${data.vLastName || ''}`.trim() || 'John Doe';
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data.vLastName || ''};${data.vFirstName || ''};;;`,
        `FN:${fn}`,
      ];

      if (data.vOrganization) lines.push(`ORG:${data.vOrganization}`);
      if (data.vTitle) lines.push(`TITLE:${data.vTitle}`);
      if (data.vPhoneMobile) lines.push(`TEL;TYPE=CELL:${data.vPhoneMobile}`);
      if (data.vPhoneWork) lines.push(`TEL;TYPE=WORK:${data.vPhoneWork}`);
      if (data.vEmail) lines.push(`EMAIL:${data.vEmail}`);
      if (data.vWebsite) lines.push(`URL:${data.vWebsite}`);

      if (data.vStreet || data.vCity || data.vState || data.vZip || data.vCountry) {
        lines.push(
          `ADR;TYPE=WORK:;;${data.vStreet || ''};${data.vCity || ''};${data.vState || ''};${data.vZip || ''};${data.vCountry || ''}`
        );
      }

      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'location': {
      if (data.locationLat && data.locationLng) {
        return `https://www.google.com/maps/search/?api=1&query=${data.locationLat},${data.locationLng}`;
      }
      if (data.locationAddress) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.locationAddress)}`;
      }
      return 'https://maps.google.com';
    }

    case 'event': {
      const dtStart = formatICalDate(data.eventStart);
      const dtEnd = formatICalDate(data.eventEnd);

      const lines = [
        'BEGIN:VEVENT',
        `SUMMARY:${data.eventTitle || 'New Event'}`,
      ];
      if (data.eventDescription) lines.push(`DESCRIPTION:${data.eventDescription}`);
      if (data.eventLocation) lines.push(`LOCATION:${data.eventLocation}`);
      if (dtStart) lines.push(`DTSTART:${dtStart}`);
      if (dtEnd) lines.push(`DTEND:${dtEnd}`);
      lines.push('END:VEVENT');
      return lines.join('\n');
    }

    case 'upi': {
      const vpa = (data.upiVpa || '').trim();
      const name = encodeURIComponent((data.upiName || '').trim());
      const amount = (data.upiAmount || '').trim();
      const note = encodeURIComponent((data.upiNote || '').trim());

      let upiStr = `upi://pay?pa=${vpa}&pn=${name}&cu=INR`;
      if (amount) upiStr += `&am=${amount}`;
      if (note) upiStr += `&tn=${note}`;
      return upiStr;
    }

    case 'social': {
      let socialUrl = (data.socialUrl || '').trim();
      if (socialUrl && !/^https?:\/\//i.test(socialUrl)) {
        socialUrl = 'https://' + socialUrl;
      }
      return socialUrl || 'https://instagram.com';
    }

    case 'app_download': {
      const ios = (data.appIosUrl || '').trim();
      const android = (data.appAndroidUrl || '').trim();
      const fallback = (data.appFallbackUrl || '').trim() || ios || android;
      return fallback || 'https://apps.apple.com';
    }

    case 'file_link': {
      let fileUrl = (data.fileUrl || '').trim();
      if (fileUrl && !/^https?:\/\//i.test(fileUrl)) {
        fileUrl = 'https://' + fileUrl;
      }
      return fileUrl || 'https://example.com/document.pdf';
    }

    default:
      return 'https://qrstudio.app';
  }
}

/**
 * Format ISO datetime into iCal YYYYMMDDTHHmmssZ string
 */
function formatICalDate(isoDateStr?: string): string {
  if (!isoDateStr) return '';
  const date = new Date(isoDateStr);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Helper to validate form input per content type
 */
export function validateContentTypeForm(type: QRContentType, data: Partial<ContentTypeFormData>): { valid: boolean; error?: string } {
  switch (type) {
    case 'url':
      if (!data.url || !data.url.trim()) return { valid: false, error: 'Please enter a valid website URL.' };
      return { valid: true };

    case 'text':
      if (!data.text || !data.text.trim()) return { valid: false, error: 'Please enter text content.' };
      return { valid: true };

    case 'email':
      if (!data.emailAddress || !/^\S+@\S+\.\S+$/.test(data.emailAddress.trim())) {
        return { valid: false, error: 'Please enter a valid email address.' };
      }
      return { valid: true };

    case 'phone':
      if (!data.phoneNumber || data.phoneNumber.trim().length < 3) {
        return { valid: false, error: 'Please enter a valid phone number.' };
      }
      return { valid: true };

    case 'sms':
      if (!data.smsPhone || data.smsPhone.trim().length < 3) {
        return { valid: false, error: 'Please enter a recipient phone number.' };
      }
      return { valid: true };

    case 'whatsapp':
      if (!data.waPhone || data.waPhone.trim().length < 3) {
        return { valid: false, error: 'Please enter a WhatsApp phone number with country code.' };
      }
      return { valid: true };

    case 'wifi':
      if (!data.wifiSsid || !data.wifiSsid.trim()) {
        return { valid: false, error: 'Please enter the Wi-Fi Network SSID.' };
      }
      return { valid: true };

    case 'vcard':
      if (!data.vFirstName && !data.vLastName) {
        return { valid: false, error: 'Please enter at least a First or Last Name for the contact.' };
      }
      return { valid: true };

    case 'location':
      if (!data.locationAddress && (!data.locationLat || !data.locationLng)) {
        return { valid: false, error: 'Please provide either an address or Latitude & Longitude.' };
      }
      return { valid: true };

    case 'event':
      if (!data.eventTitle || !data.eventTitle.trim()) {
        return { valid: false, error: 'Please enter an event title.' };
      }
      return { valid: true };

    case 'upi':
      if (!data.upiVpa || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(data.upiVpa.trim())) {
        return { valid: false, error: 'Please enter a valid UPI VPA ID (e.g. username@upi).' };
      }
      return { valid: true };

    case 'social':
      if (!data.socialUrl || !data.socialUrl.trim()) {
        return { valid: false, error: 'Please enter your social profile link.' };
      }
      return { valid: true };

    case 'app_download':
      if (!data.appIosUrl && !data.appAndroidUrl && !data.appFallbackUrl) {
        return { valid: false, error: 'Please enter at least one App Store or Play Store link.' };
      }
      return { valid: true };

    case 'file_link':
      if (!data.fileUrl || !data.fileUrl.trim()) {
        return { valid: false, error: 'Please enter a valid document / file URL.' };
      }
      return { valid: true };

    default:
      return { valid: true };
  }
}
