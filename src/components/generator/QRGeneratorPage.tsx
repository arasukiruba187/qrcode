import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentTypeFormData, QRCustomization, QRContentType, QRType } from '../../types';
import { DEFAULT_QR_CUSTOMIZATION } from '../../config/appConfig';
import { formatQRContent, validateContentTypeForm } from '../../services/qrGenerator';
import { ContentTypeForms, ContentTypeIconMap } from './ContentTypeForms';
import { CustomizationPanel } from './CustomizationPanel';
import { QRPreviewCard } from './QRPreviewCard';
import { getAppsScriptUrl } from '../../services/apiService';
import {
  Sparkles,
  Zap,
  RefreshCw,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Calendar,
  Lock,
  Hash,
  Database,
  Info
} from 'lucide-react';

export const QRGeneratorPage: React.FC = () => {
  const { handleCreateRecord, setCurrentTab, addToast } = useApp();
  const [qrType, setQrType] = useState<QRType>('dynamic');
  const [contentType, setContentType] = useState<QRContentType>('url');
  const [qrName, setQrName] = useState<string>('My QR Code');
  const [campaign, setCampaign] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('marketing, campaign');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [scanLimit, setScanLimit] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<ContentTypeFormData>({
    url: 'https://qrstudio.app',
    text: '',
    emailAddress: '',
    emailSubject: '',
    emailBody: '',
    phoneNumber: '',
    smsPhone: '',
    smsMessage: '',
    waPhone: '',
    waMessage: '',
    wifiSsid: '',
    wifiPassword: '',
    wifiEncryption: 'WPA',
    wifiHidden: false,
    vFirstName: '',
    vLastName: '',
    vOrganization: '',
    vTitle: '',
    vPhoneMobile: '',
    vPhoneWork: '',
    vEmail: '',
    vWebsite: '',
    vStreet: '',
    vCity: '',
    vState: '',
    vZip: '',
    vCountry: '',
    locationLat: '',
    locationLng: '',
    locationAddress: '',
    eventTitle: '',
    eventDescription: '',
    eventLocation: '',
    eventStart: '',
    eventEnd: '',
    upiVpa: '',
    upiName: '',
    upiAmount: '',
    upiNote: '',
    socialPlatform: 'Instagram',
    socialHandle: '',
    socialUrl: '',
    appIosUrl: '',
    appAndroidUrl: '',
    appFallbackUrl: '',
    fileUrl: '',
    fileName: ''
  });

  // Customization State
  const [customization, setCustomization] = useState<QRCustomization>(DEFAULT_QR_CUSTOMIZATION);
  const [activeTabPanel, setActiveTabPanel] = useState<'content' | 'style'>('content');

  const handleFormDataChange = (updated: Partial<ContentTypeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleCustomizationChange = (updated: Partial<QRCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...updated }));
  };

  // Raw Content Calculation
  const formattedContent = formatQRContent(contentType, formData);
  
  // Destination for Dynamic QR
  const dynamicDestinationUrl = formattedContent;
  
  // Display string in Preview
  const previewContent = qrType === 'dynamic' 
    ? (getAppsScriptUrl() ? `${getAppsScriptUrl()}?action=redirect&id=PREVIEW_ID` : `https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=redirect&id=PREVIEW_ID`)
    : formattedContent;

  const handleSaveQR = async () => {
    // 1. Validate Form
    const validation = validateContentTypeForm(contentType, formData);
    if (!validation.valid) {
      addToast(validation.error || 'Please fill in required fields.', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const tagsList = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      await handleCreateRecord({
        qrName: qrName.trim() || 'Untitled QR',
        qrType,
        contentType,
        staticContent: qrType === 'static' ? formattedContent : '',
        destinationUrl: qrType === 'dynamic' ? dynamicDestinationUrl : '',
        shortRedirectUrl: '',
        status: 'active',
        expiresAt: expiresAt || undefined,
        scanLimit: scanLimit > 0 ? scanLimit : undefined,
        campaign: campaign.trim(),
        tags: tagsList,
        customizationJson: customization,
        createdBy: 'Arasukirubanandhan'
      });

      // Navigate to Dashboard
      setCurrentTab('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const contentTypesList = Object.keys(ContentTypeIconMap) as QRContentType[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 light:border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white light:text-slate-900 font-sans tracking-tight">
            QR Code Generator
          </h1>
          <p className="text-sm text-slate-400 light:text-slate-600 mt-1">
            Build, customize, and publish static or dynamic QR codes in real-time.
          </p>
        </div>

        {/* Static vs Dynamic Main Tab Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-navy-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 w-fit">
          <button
            onClick={() => setQrType('dynamic')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              qrType === 'dynamic'
                ? 'bg-electric-600 text-white shadow-lg shadow-electric-600/30'
                : 'text-slate-400 light:text-slate-600 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Dynamic QR (Editable & Analytics)</span>
          </button>
          <button
            onClick={() => setQrType('static')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              qrType === 'static'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 light:text-slate-600 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Static QR (Permanent Content)</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC QR DISCLAIMER NOTE */}
      {qrType === 'dynamic' && (
        <div className="p-4 rounded-2xl bg-electric-950/40 border border-electric-500/30 text-electric-200 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Dynamic Redirect & Google Apps Script Quota Note</p>
            <p className="text-slate-300 light:text-slate-600 mt-0.5">
              Dynamic QR codes route through your Google Apps Script Web App API to log scans in Google Sheets before redirecting to your destination. Standard Google API execution limits (~20,000 requests/day) apply.
            </p>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONTROLS & CONTENT (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: CONTENT TYPE SELECTOR GRID */}
          <div className="p-6 rounded-3xl bg-navy-900/70 light:bg-white border border-slate-800 light:border-slate-200 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white light:text-slate-900 uppercase tracking-wider font-sans">
                1. Select Content Type
              </h2>
              <span className="text-xs text-slate-400">14 Formats Available</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {contentTypesList.map((typeKey) => {
                const item = ContentTypeIconMap[typeKey];
                const Icon = item.icon;
                const isSelected = contentType === typeKey;
                return (
                  <button
                    key={typeKey}
                    onClick={() => setContentType(typeKey)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-electric-600/20 text-electric-300 border-electric-500 shadow-md scale-[1.02]'
                        : 'bg-navy-950 light:bg-slate-50 text-slate-400 light:text-slate-600 border-slate-800 light:border-slate-200 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5 text-electric-400" />
                    <span className="text-xs font-semibold leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: CONTENT & STYLE TAB TOGGLE */}
          <div className="p-6 rounded-3xl bg-navy-900/70 light:bg-white border border-slate-800 light:border-slate-200 space-y-6 shadow-xl">
            
            <div className="flex items-center border-b border-slate-800 light:border-slate-200 pb-4 gap-4">
              <button
                onClick={() => setActiveTabPanel('content')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  activeTabPanel === 'content'
                    ? 'border-electric-500 text-electric-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Data Inputs & Details
              </button>
              <button
                onClick={() => setActiveTabPanel('style')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  activeTabPanel === 'style'
                    ? 'border-electric-500 text-electric-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Styling & Colors
              </button>
            </div>

            {/* TAB PANEL 1: DATA FORM & CAMPAIGN METADATA */}
            {activeTabPanel === 'content' && (
              <div className="space-y-6">
                
                {/* QR Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                    QR Name / Campaign Title *
                  </label>
                  <input
                    type="text"
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    placeholder="e.g. Summer Promo 2026 Flyer"
                    className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-sm font-medium focus:outline-none focus:border-electric-500"
                  />
                </div>

                {/* Specific Content Type Input Fields */}
                <ContentTypeForms
                  contentType={contentType}
                  formData={formData}
                  onChange={handleFormDataChange}
                />

                {/* Dynamic QR Campaign Settings */}
                {qrType === 'dynamic' && (
                  <div className="pt-6 border-t border-slate-800 light:border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 light:text-slate-700 uppercase tracking-wider">
                      Dynamic Campaign Options
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1.5">Campaign Group Tag</label>
                        <div className="relative">
                          <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            value={campaign}
                            onChange={(e) => setCampaign(e.target.value)}
                            placeholder="e.g. Marketing Q3"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1.5">Comma-Separated Tags</label>
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          placeholder="e.g. restaurant, print, menu"
                          className="w-full p-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1.5">Optional Expiration Date</label>
                        <input
                          type="date"
                          value={expiresAt}
                          onChange={(e) => setExpiresAt(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1.5">Scan Limit (0 = Unlimited)</label>
                        <input
                          type="number"
                          min="0"
                          value={scanLimit}
                          onChange={(e) => setScanLimit(parseInt(e.target.value) || 0)}
                          placeholder="1000"
                          className="w-full p-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB PANEL 2: CUSTOM STYLING PANEL */}
            {activeTabPanel === 'style' && (
              <CustomizationPanel
                customization={customization}
                onChange={handleCustomizationChange}
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW CARD (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24">
            <QRPreviewCard
              content={previewContent}
              qrType={qrType}
              qrName={qrName}
              customization={customization}
              onSave={handleSaveQR}
              isSaving={isSaving}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
