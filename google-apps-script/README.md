# Streamlined Google Apps Script Setup for QR Studio

**Designed by Arasukirubanandhan**

This simplified Google Apps Script Web App stores all QR codes, destination URLs, and total scan counters in **1 single sheet (`QRCodes`)**. It does NOT log user agents, IPs, or detailed visitor logs, ensuring maximum speed and privacy.

---

## ⚡ 1-Sheet Setup Instructions

### Step 1: Create a Google Sheet
1. Open Google Drive and create a new Google Spreadsheet.
2. Name it **`QR Studio Database`**.

### Step 2: Add the Apps Script Code
1. In the Google Sheet top menu, click **Extensions** > **Apps Script**.
2. Delete any default code in `Code.gs`.
3. Copy and paste the contents of `google-apps-script/Code.gs` into the editor.
4. Click the 💾 **Save** icon (or press Ctrl+S / Cmd+S).

### Step 3: Run Auto-Setup
- Click **"QR Studio > ⚙️ Setup QRCodes Sheet"** in your Google Sheet menu, OR select `setupDatabase` in the toolbar and click **Run**.

> 🪄 This automatically creates the **`QRCodes`** sheet with all required columns and header styling!

---

### Step 4: Deploy as Web App
1. Click **Deploy > New deployment > Web app**.
2. Settings:
   - **Description**: `QR Studio Streamlined API v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
3. Click **Deploy** and copy the **Web App URL**.
4. Paste the Web App URL into QR Studio Settings!

---

## 📋 QRCodes Sheet Column Structure

`id` | `qrName` | `qrType` | `contentType` | `staticContent` | `destinationUrl` | `shortRedirectUrl` | `status` | `createdAt` | `updatedAt` | `expiresAt` | `scanLimit` | `passwordHash` | `campaign` | `tags` | `customizationJson` | `totalScans` | `lastScanAt` | `createdBy`
