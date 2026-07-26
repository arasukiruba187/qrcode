/**
 * ==============================================================================
 * QR STUDIO - Google Apps Script Web App Backend & REST API
 * Designed by Arasukirubanandhan
 * ==============================================================================
 * 
 * 🚀 ONE-CLICK AUTO SETUP INSTRUCTIONS:
 * -------------------------------------
 * 1. Create a new Google Sheet named "QR Studio Database".
 * 2. Click Extensions > Apps Script in the Google Sheets top menu.
 * 3. Delete any default code in Code.gs and paste this ENTIRE file.
 * 4. Run the function `setupDatabase` once from the top toolbar, OR open the 
 *    Google Sheet and click "QR Studio > ⚙️ Auto-Setup Database Sheets".
 *    (All sheets and columns will be created automatically!)
 * 5. Click Deploy > New deployment.
 * 6. Select type "Web app":
 *    - Description: "QR Studio API v1"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Required for public QR scanning & API)
 * 7. Copy the deployed Web App URL and paste it into QR Studio Settings!
 * ==============================================================================
 */

// Global Config
var SPREADSHEET_ID = ""; // Leave blank if script is bound to Google Sheet

/**
 * Get active spreadsheet handle
 */
function getDb() {
  var ss;
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  // Auto-init sheets if QRCodes missing
  if (ss && !ss.getSheetByName("QRCodes")) {
    setupDatabase(ss);
  }
  return ss;
}

/**
 * AUTOMATIC DATABASE INITIALIZATION
 * Creates all required sheets, sets column headers, and formats header rows.
 */
function setupDatabase(targetSs) {
  var ss = targetSs || (SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet());
  if (!ss) return "Error: Could not access Google Sheet.";

  var schemas = {
    "QRCodes": [
      "id", "qrName", "qrType", "contentType", "staticContent", 
      "destinationUrl", "shortRedirectUrl", "status", "createdAt", 
      "updatedAt", "expiresAt", "scanLimit", "passwordHash", 
      "campaign", "tags", "customizationJson", "totalScans", "lastScanAt", "createdBy"
    ],
    "ScanLogs": [
      "scanId", "qrId", "timestamp", "visitorId", "userAgent", 
      "deviceType", "browser", "operatingSystem", "referrer", 
      "language", "country", "ipHash", "redirectUrl"
    ],
    "Settings": [
      "key", "value"
    ]
  };

  for (var sheetName in schemas) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Check if headers exist
    var headers = schemas[sheetName];
    var lastRow = sheet.getLastRow();
    
    if (lastRow === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Professional header formatting
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0B0F19");
      headerRange.setFontColor("#60A5FA");
      sheet.setFrozenRows(1);
    }
  }

  // Safely delete empty default "Sheet1" if other sheets exist
  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {}
  }

  Logger.log("Database initialized successfully! Created QRCodes, ScanLogs, and Settings sheets.");
  return "Database initialized successfully! All sheets and columns created.";
}

/**
 * Creates custom "QR Studio" menu in Google Sheets UI
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('QR Studio')
      .addItem('⚙️ Auto-Setup Database Sheets', 'setupDatabase')
      .addToUi();
  } catch (e) {
    // Ignore if running outside Sheets UI container
  }
}

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  var params = e ? e.parameter : {};
  var action = params.action || "";

  // Auto setup check
  getDb();

  // 1. Dynamic QR Redirect endpoint
  if (action === "redirect") {
    return handleRedirect(e);
  }

  // 2. REST API GET endpoints
  switch (action) {
    case "health":
      return jsonResponse({ status: "ok", timestamp: new Date().toISOString(), app: "QR Studio Backend", designer: "Arasukirubanandhan" });
    case "setup":
      var setupMsg = setupDatabase();
      return jsonResponse({ status: "success", message: setupMsg });
    case "getQRCodes":
      return handleGetQRCodes(params);
    case "getQR":
      return handleGetQR(params);
    case "getAnalytics":
      return handleGetAnalytics(params);
    case "exportAnalytics":
      return handleExportAnalytics(params);
    default:
      return jsonResponse({ status: "error", message: "Invalid or missing action parameter." }, 400);
  }
}

/**
 * Handle HTTP POST Requests
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({ status: "error", message: "Server busy. Could not obtain script lock." }, 503);
  }

  try {
    getDb(); // Ensure database tables exist

    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (ex) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || (e ? e.parameter.action : "");

    switch (action) {
      case "createQR":
        return handleCreateQR(payload);
      case "updateQR":
        return handleUpdateQR(payload);
      case "deleteQR":
        return handleDeleteQR(payload);
      case "duplicateQR":
        return handleDuplicateQR(payload);
      case "logScan":
        return handleLogScan(payload);
      case "setup":
        var setupMsg = setupDatabase();
        return jsonResponse({ status: "success", message: setupMsg });
      default:
        return jsonResponse({ status: "error", message: "Invalid or missing POST action." }, 400);
    }
  } catch (error) {
    return jsonResponse({ status: "error", message: error.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Utility: Standard JSON Response
 */
function jsonResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Helper: Read Sheet Records as Objects
 */
function getSheetRecords(sheetName) {
  var sheet = getDb().getSheetByName(sheetName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0];
  var records = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    var isEmptyRow = true;
    for (var j = 0; j < headers.length; j++) {
      var val = row[j];
      obj[headers[j]] = val;
      if (val !== "" && val !== null) isEmptyRow = false;
    }
    if (!isEmptyRow && obj.id) {
      records.push(obj);
    }
  }
  return records;
}

/**
 * Helper: Find Row Index by ID (1-based row number)
 */
function findRowIndexById(sheet, idColumnIndex, targetId) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idColumnIndex]) === String(targetId)) {
      return i + 1;
    }
  }
  return -1;
}

/**
 * ACTION: createQR
 */
function handleCreateQR(payload) {
  var sheet = getDb().getSheetByName("QRCodes");
  if (!sheet) return jsonResponse({ status: "error", message: "QRCodes sheet missing." }, 500);

  var qrId = payload.id || "qr_" + new Date().getTime() + "_" + Math.random().toString(36).substring(2, 7);
  var now = new Date().toISOString();

  var qrName = payload.qrName || "Untitled QR";
  var qrType = payload.qrType || "static";
  var contentType = payload.contentType || "url";
  var staticContent = payload.staticContent || "";
  var destinationUrl = payload.destinationUrl || "";
  var webAppUrl = ScriptApp.getService().getUrl() || "";
  var shortRedirectUrl = qrType === "dynamic" ? (webAppUrl + "?action=redirect&id=" + qrId) : "";
  var status = payload.status || "active";
  var expiresAt = payload.expiresAt || "";
  var scanLimit = payload.scanLimit ? Number(payload.scanLimit) : 0;
  var passwordHash = payload.passwordHash || "";
  var campaign = payload.campaign || "";
  var tags = Array.isArray(payload.tags) ? payload.tags.join(",") : (payload.tags || "");
  var customizationJson = typeof payload.customizationJson === "object" ? JSON.stringify(payload.customizationJson) : (payload.customizationJson || "{}");
  var createdBy = payload.createdBy || "Arasukirubanandhan";

  var newRow = [
    qrId,
    qrName,
    qrType,
    contentType,
    staticContent,
    destinationUrl,
    shortRedirectUrl,
    status,
    now,
    now,
    expiresAt,
    scanLimit,
    passwordHash,
    campaign,
    tags,
    customizationJson,
    0,
    "",
    createdBy
  ];

  sheet.appendRow(newRow);

  return jsonResponse({
    status: "success",
    message: "QR Code created successfully.",
    data: {
      id: qrId,
      qrName: qrName,
      qrType: qrType,
      contentType: contentType,
      staticContent: staticContent,
      destinationUrl: destinationUrl,
      shortRedirectUrl: shortRedirectUrl,
      status: status,
      createdAt: now,
      updatedAt: now,
      expiresAt: expiresAt,
      scanLimit: scanLimit,
      campaign: campaign,
      tags: tags,
      customizationJson: customizationJson,
      totalScans: 0
    }
  });
}

/**
 * ACTION: getQRCodes
 */
function handleGetQRCodes(params) {
  var records = getSheetRecords("QRCodes");
  return jsonResponse({
    status: "success",
    count: records.length,
    data: records
  });
}

/**
 * ACTION: getQR
 */
function handleGetQR(params) {
  var qrId = params.id;
  if (!qrId) return jsonResponse({ status: "error", message: "Missing QR ID." }, 400);

  var records = getSheetRecords("QRCodes");
  for (var i = 0; i < records.length; i++) {
    if (String(records[i].id) === String(qrId)) {
      return jsonResponse({ status: "success", data: records[i] });
    }
  }

  return jsonResponse({ status: "error", message: "QR code not found." }, 404);
}

/**
 * ACTION: updateQR
 */
function handleUpdateQR(payload) {
  var qrId = payload.id;
  if (!qrId) return jsonResponse({ status: "error", message: "Missing QR ID." }, 400);

  var sheet = getDb().getSheetByName("QRCodes");
  var rowIndex = findRowIndexById(sheet, 0, qrId);
  if (rowIndex === -1) return jsonResponse({ status: "error", message: "QR record not found." }, 404);

  var now = new Date().toISOString();
  var headers = sheet.getDataRange().getValues()[0];

  var currentRow = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];

  if (payload.qrName !== undefined) currentRow[1] = payload.qrName;
  if (payload.destinationUrl !== undefined) currentRow[5] = payload.destinationUrl;
  if (payload.status !== undefined) currentRow[7] = payload.status;
  currentRow[9] = now;
  if (payload.expiresAt !== undefined) currentRow[10] = payload.expiresAt;
  if (payload.scanLimit !== undefined) currentRow[11] = Number(payload.scanLimit);
  if (payload.passwordHash !== undefined) currentRow[12] = payload.passwordHash;
  if (payload.campaign !== undefined) currentRow[13] = payload.campaign;
  if (payload.tags !== undefined) currentRow[14] = Array.isArray(payload.tags) ? payload.tags.join(",") : payload.tags;
  if (payload.customizationJson !== undefined) {
    currentRow[15] = typeof payload.customizationJson === "object" ? JSON.stringify(payload.customizationJson) : payload.customizationJson;
  }

  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([currentRow]);

  return jsonResponse({ status: "success", message: "QR updated successfully.", data: { id: qrId, updatedAt: now } });
}

/**
 * ACTION: deleteQR
 */
function handleDeleteQR(payload) {
  var qrId = payload.id;
  if (!qrId) return jsonResponse({ status: "error", message: "Missing QR ID." }, 400);

  var sheet = getDb().getSheetByName("QRCodes");
  var rowIndex = findRowIndexById(sheet, 0, qrId);
  if (rowIndex === -1) return jsonResponse({ status: "error", message: "QR record not found." }, 404);

  sheet.deleteRow(rowIndex);
  return jsonResponse({ status: "success", message: "QR code deleted." });
}

/**
 * ACTION: duplicateQR
 */
function handleDuplicateQR(payload) {
  var qrId = payload.id;
  if (!qrId) return jsonResponse({ status: "error", message: "Missing original QR ID." }, 400);

  var records = getSheetRecords("QRCodes");
  var original = null;
  for (var i = 0; i < records.length; i++) {
    if (String(records[i].id) === String(qrId)) {
      original = records[i];
      break;
    }
  }

  if (!original) return jsonResponse({ status: "error", message: "Original QR not found." }, 404);

  var newPayload = Object.assign({}, original, {
    id: "qr_" + new Date().getTime() + "_" + Math.random().toString(36).substring(2, 7),
    qrName: (original.qrName || "QR") + " (Copy)",
    totalScans: 0,
    lastScanAt: ""
  });

  return handleCreateQR(newPayload);
}

/**
 * ACTION: handleRedirect (Dynamic Scanning)
 */
function handleRedirect(e) {
  var params = e.parameter;
  var qrId = params.id;

  if (!qrId) {
    return HtmlService.createHtmlOutput("<h3>QR Studio: Invalid QR link. ID missing.</h3>");
  }

  var targetQR = null;
  var rowIndex = -1;

  var sheet = getDb().getSheetByName("QRCodes");
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(qrId)) {
      rowIndex = i + 1;
      targetQR = {
        id: data[i][0],
        qrName: data[i][1],
        qrType: data[i][2],
        contentType: data[i][3],
        destinationUrl: data[i][5],
        status: data[i][7],
        expiresAt: data[i][10],
        scanLimit: Number(data[i][11] || 0),
        passwordHash: data[i][12],
        totalScans: Number(data[i][16] || 0)
      };
      break;
    }
  }

  if (!targetQR) {
    return HtmlService.createHtmlOutput("<h3>QR Code Not Found</h3><p>This QR code does not exist or was removed.</p>");
  }

  // Check Status
  if (targetQR.status === "paused") {
    return HtmlService.createHtmlOutput("<h3>QR Code Paused</h3><p>This campaign is currently paused by its owner.</p>");
  }

  // Check Expiry
  if (targetQR.expiresAt) {
    var expDate = new Date(targetQR.expiresAt);
    if (!isNaN(expDate.getTime()) && expDate < new Date()) {
      return HtmlService.createHtmlOutput("<h3>QR Code Expired</h3><p>This QR code campaign expired on " + targetQR.expiresAt + "</p>");
    }
  }

  // Check Scan Limit
  if (targetQR.scanLimit > 0 && targetQR.totalScans >= targetQR.scanLimit) {
    return HtmlService.createHtmlOutput("<h3>Scan Limit Reached</h3><p>This QR code has reached its maximum scan limit of " + targetQR.scanLimit + " scans.</p>");
  }

  var finalDestination = targetQR.destinationUrl || "https://google.com";
  if (!/^https?:\/\//i.test(finalDestination)) {
    finalDestination = "https://" + finalDestination;
  }

  // Log Scan
  var scanId = "scan_" + new Date().getTime() + "_" + Math.random().toString(36).substring(2, 6);
  var now = new Date().toISOString();

  var userAgent = e.parameter.ua || "";
  var visitorId = e.parameter.vid || ("v_" + Math.random().toString(36).substring(2, 10));
  var ref = e.parameter.ref || "";

  var scanSheet = getDb().getSheetByName("ScanLogs");
  if (scanSheet) {
    scanSheet.appendRow([
      scanId,
      qrId,
      now,
      visitorId,
      userAgent,
      parseDevice(userAgent),
      parseBrowser(userAgent),
      parseOS(userAgent),
      ref,
      e.parameter.lang || "en",
      "Unknown",
      "",
      finalDestination
    ]);
  }

  // Increment totalScans and update lastScanAt
  if (rowIndex !== -1) {
    var updatedScans = targetQR.totalScans + 1;
    sheet.getRange(rowIndex, 17).setValue(updatedScans);
    sheet.getRange(rowIndex, 18).setValue(now);
  }

  // Perform Redirect HTML
  var html = '<!DOCTYPE html><html><head>' +
    '<meta charset="utf-8">' +
    '<meta http-equiv="refresh" content="0;url=' + encodeURI(finalDestination) + '">' +
    '<script>window.location.href = "' + encodeURI(finalDestination) + '";</script>' +
    '<title>Redirecting...</title>' +
    '</head><body style="font-family:sans-serif;text-align:center;padding:50px;background:#0B0F19;color:#fff;">' +
    '<h2>Redirecting to destination...</h2>' +
    '<p>If you are not redirected automatically, <a href="' + encodeURI(finalDestination) + '" style="color:#3B82F6;">click here</a>.</p>' +
    '</body></html>';

  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * ACTION: getAnalytics
 */
function handleGetAnalytics(params) {
  var qrId = params.id;
  var logs = getSheetRecords("ScanLogs");

  if (qrId) {
    logs = logs.filter(function(log) {
      return String(log.qrId) === String(qrId);
    });
  }

  var totalScans = logs.length;
  var uniqueVisitorMap = {};
  var scansByDate = {};
  var deviceMap = {};
  var browserMap = {};
  var osMap = {};

  logs.forEach(function(log) {
    if (log.visitorId) uniqueVisitorMap[log.visitorId] = true;

    var dateStr = (log.timestamp || "").substring(0, 10) || "Unknown";
    scansByDate[dateStr] = (scansByDate[dateStr] || 0) + 1;

    var dev = log.deviceType || "Desktop";
    deviceMap[dev] = (deviceMap[dev] || 0) + 1;

    var br = log.browser || "Other";
    browserMap[br] = (browserMap[br] || 0) + 1;

    var os = log.operatingSystem || "Other";
    osMap[os] = (osMap[os] || 0) + 1;
  });

  return jsonResponse({
    status: "success",
    data: {
      qrId: qrId || "all",
      totalScans: totalScans,
      uniqueVisitors: Object.keys(uniqueVisitorMap).length,
      scansByDate: scansByDate,
      devices: deviceMap,
      browsers: browserMap,
      operatingSystems: osMap,
      recentLogs: logs.slice(-50).reverse()
    }
  });
}

/**
 * ACTION: exportAnalytics
 */
function handleExportAnalytics(params) {
  return handleGetAnalytics(params);
}

/**
 * Helper parsers
 */
function parseDevice(ua) {
  if (!ua) return "Mobile";
  if (/mobile/i.test(ua)) return "Mobile";
  if (/tablet|ipad/i.test(ua)) return "Tablet";
  return "Desktop";
}

function parseBrowser(ua) {
  if (!ua) return "Chrome";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/edg/i.test(ua)) return "Edge";
  return "Mobile Browser";
}

function parseOS(ua) {
  if (!ua) return "Android/iOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac os/i.test(ua)) return "macOS";
  if (/windows/i.test(ua)) return "Windows";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}
