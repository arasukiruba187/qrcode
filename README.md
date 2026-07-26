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

## 📁 Repository Structure

```
QR code generator/
├── google-apps-script/
│   ├── Code.gs             # Complete Google Apps Script backend code
│   └── README.md           # Step-by-step Google Sheets setup guide
├── src/
│   ├── components/
│   │   ├── analytics/      # Dynamic QR Analytics dashboard
│   │   ├── common/         # Header, Footer, Toast, Modal
│   │   ├── dashboard/      # Campaign Dashboard & QR Detail Modal
│   │   ├── generator/      # 14 Content Type forms, Customization panel, Live preview
│   │   ├── landing/        # Hero page, Static vs Dynamic comparison matrix, FAQ
│   │   ├── print/          # Printable QR card view
│   │   └── settings/       # Apps Script Web App URL setup
│   ├── config/             # App defaults, preset templates & mock database
│   ├── context/            # ThemeContext (Dark/Light) & AppContext
│   ├── services/           # apiService, qrGenerator formatters, scanabilityChecker
│   ├── types/              # TypeScript interfaces & types
│   ├── App.tsx             # Main routing & app container
│   ├── index.css           # Tailwind directives & glassmorphism CSS
│   └── main.tsx            # Entry point
├── index.html              # HTML shell & font definitions
├── package.json            # Node dependencies
├── tailwind.config.js      # Custom navy & electric blue theme setup
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build config
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

1. Open Drive and create a new Google Sheet named **`QR Studio Database`**.
2. Create 3 sheets named: `QRCodes`, `ScanLogs`, and `Settings`.
3. Add the exact row 1 column headers documented in `google-apps-script/README.md`.
4. Open **Extensions > Apps Script**, paste `google-apps-script/Code.gs`, and click **Deploy > New deployment**.
5. Set **Execute as**: `Me`, **Who has access**: `Anyone`.
6. Copy the deployed Web App URL.
7. Open QR Studio > **Settings** > Paste your Web App URL > Click **Save & Connect**.

---

## ⚠️ Known Limitations & Architecture Notes

- **Apps Script Quotas**: Google Apps Script web apps operate under standard Google API daily quotas (~20,000 requests/day for standard Google accounts).
- **Analytics Precision**: Device types, OS, and browsers are parsed from HTTP User-Agent headers. Unique visitors are estimated via anonymized session tokens.

---

## 👤 Designer & Author

**Designed & Developed by Arasukirubanandhan**
