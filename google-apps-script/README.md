# Google Apps Script Setup for QR Studio

**Designed by Arasukirubanandhan**

QR Studio uses a Google Apps Script Web App backed by Google Sheets to store QR codes, manage dynamic redirects, and record real-time analytics.

---

## ⚡ Automated 1-Click Setup Instructions

### Step 1: Create a Google Sheet
1. Open Google Drive and create a new Google Spreadsheet.
2. Name it **`QR Studio Database`**.

### Step 2: Add the Apps Script Code
1. In the Google Sheet top menu, click **Extensions** > **Apps Script**.
2. Delete any default code in `Code.gs`.
3. Copy and paste the contents of `google-apps-script/Code.gs` into the editor.
4. Click the 💾 **Save** icon (or press Ctrl+S / Cmd+S).

### Step 3: Run Auto-Setup
You have 2 easy ways to generate all sheets and columns automatically:

- **Option A (From Apps Script Editor)**:
  Select `setupDatabase` in the top function dropdown and click **Run**.

- **Option B (From Google Sheets Menu)**:
  Refresh your Google Sheet tab, click the custom menu item **QR Studio** > **⚙️ Auto-Setup Database Sheets**.

> 🪄 This automatically creates the **`QRCodes`**, **`ScanLogs`**, and **`Settings`** sheets with all required columns, dark header formatting, and frozen top rows!

---

### Step 4: Deploy as Web App
1. Click the **Deploy** button at the top right > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and select **Web app**.
3. Fill in details:
   - **Description**: `QR Studio API v1`
   - **Execute as**: `Me` (your Google Account)
   - **Who has access**: `Anyone` (Crucial so dynamic QR scans and frontend requests work without login prompts).
4. Click **Deploy**.
5. Grant permissions if prompted by Google (click *Advanced* > *Go to QR Studio Script (unsafe)* > *Allow*).
6. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 5: Connect to QR Studio Frontend
1. Open your QR Studio Web App.
2. Click **Settings** in the header navigation or bottom footer.
3. Paste your Web App URL into the **Google Apps Script Web App URL** input field.
4. Click **Save & Connect**.
5. You're ready! All newly generated dynamic QR codes and analytics will sync directly with your Google Sheet.

---

## 📋 Generated Database Schema Overview

### Sheet 1: `QRCodes`
Columns automatically created:
`id`, `qrName`, `qrType`, `contentType`, `staticContent`, `destinationUrl`, `shortRedirectUrl`, `status`, `createdAt`, `updatedAt`, `expiresAt`, `scanLimit`, `passwordHash`, `campaign`, `tags`, `customizationJson`, `totalScans`, `lastScanAt`, `createdBy`

### Sheet 2: `ScanLogs`
Columns automatically created:
`scanId`, `qrId`, `timestamp`, `visitorId`, `userAgent`, `deviceType`, `browser`, `operatingSystem`, `referrer`, `language`, `country`, `ipHash`, `redirectUrl`

### Sheet 3: `Settings`
Columns automatically created:
`key`, `value`
