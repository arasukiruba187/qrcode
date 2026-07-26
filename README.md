# 🚀 QR Studio

> **Designed by Arasukirubanandhan**
> A modern, high-performance QR Code Creation & Dynamic Analytics Web Application built with React, TypeScript, Tailwind CSS, and a Google Apps Script + Google Sheets REST API backend.

---

## 🌟 Key Features

1. **Brand & Visual Aesthetics**:
   - Modern dark navy (`#0B0F19`), electric blue (`#3B82F6`), and purple gradient theme with glassmorphism cards and smooth micro-animations.
   - Designer Credit: **"Designed by Arasukirubanandhan"** featured across headers, footers, PDF exports, and print views.
   - Full Light / Dark mode toggle.

2. **14 Content Formats Supported**:
   - **Website URL**: Direct landing page links.
   - **Plain Text**: Raw text messages, promo codes, and instructions.
   - **Email**: Pre-filled email recipient, subject line, and body text.
   - **Phone Call**: One-tap phone number dialing (`tel:`).
   - **SMS**: Pre-written SMS message (`smsto:`).
   - **WhatsApp**: Direct chat link with custom pre-filled message (`wa.me`).
   - **Wi-Fi Network**: Automated Wi-Fi connection strings (WPA/WEP/Open, hidden network support).
   - **vCard / Contact**: Complete vCard 3.0 specs (Name, Title, Org, Phone, Email, Address, Website).
   - **Google Maps / Location**: Address or GPS coordinates (`lat,lng`).
   - **Event / Calendar**: iCal event format (Title, Location, Datetime range).
   - **UPI Payment**: Indian UPI payment format (`upi://pay?pa=...&am=...`).
   - **Social Profile Links**: Direct social media handle links.
   - **App Store Download**: Smart fallback app store download links.
   - **PDF / Document Link**: Direct file download links.

3. **Advanced QR Customization Engine**:
   - 5 Dot pattern shapes (`square`, `rounded`, `dots`, `classy`, `extra-rounded`).
   - Single colors and linear/radial gradient foreground dots.
   - Corner eye frame & eye ball shapes (`square`, `rounded`, `extra-rounded`, `dot`).
   - Upload centered brand logo image with safe-size scaling slider.
   - Error Correction selection (`L`, `M`, `Q`, `H` - up to 30% recovery).
   - 6 Instant Presets (Business, Restaurant, Event, Payment, Wi-Fi, Social).
   - Real-time **Scanability Health Checker** algorithm evaluating contrast ratio, logo proportion, and matrix density.

4. **Dynamic QR & Google Sheets Integration**:
   - **Editable Target URL**: Update where existing printed QR codes redirect to anytime without re-printing.
   - **Campaign Controls**: Active / Paused toggles, expiration dates, scan count limits, and tags.
   - **Google Apps Script REST API Backend**: Full `Code.gs` included for serverless execution backed by Google Sheets (`QRCodes`, `ScanLogs`, `Settings`).
   - Built-in **Mock Demo Mode** for immediate offline preview when Apps Script URL is pending.

5. **Analytics & Exports**:
   - Lifetime total scans, estimated unique visitor counts, scans timeline by date, device category (Mobile vs Desktop), OS, and Browser.
   - Export analytics logs to CSV format.
   - High-res PNG, vector SVG, styled PDF print card export, and print preview view.

---

## 🌐 Deploy to Vercel (Recommended)

### Option 1: Vercel Dashboard (1-Click GitHub Import)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New > Project**.
3. Select your repository: **`arasukiruba187/qrcode`**.
4. Vercel auto-detects Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your app will be live in 30 seconds at a `https://qrcode-xxxx.vercel.app` URL!

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🛠️ Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 📊 Google Apps Script & Google Sheets Setup

To persist QR codes and track scan analytics to your own Google Sheet:

1. Open Drive and create a new Google Spreadsheet named **`QR Studio Database`**.
2. Click **Extensions > Apps Script**, paste `google-apps-script/Code.gs`, and run `setupDatabase`.
3. Click **Deploy > New deployment > Web app**:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Copy the deployed Web App URL.
5. Open your deployed QR Studio site > **Settings** > Paste your Web App URL > Click **Save & Connect**.

---

## 👤 Designer & Author

**Designed & Developed by Arasukirubanandhan**
