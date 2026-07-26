import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  LayoutDashboard,
  QrCode,
  Zap,
  ShieldCheck,
  BarChart3,
  Globe,
  CheckCircle2,
  ChevronDown,
  Layers,
  RefreshCw,
  Palette,
  FileSpreadsheet,
  ArrowRight,
  Sliders,
  Download
} from 'lucide-react';
import { DESIGNER_CREDIT } from '../../config/appConfig';

export const LandingPage: React.FC = () => {
  const { setCurrentTab } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is the difference between Static and Dynamic QR Codes?',
      a: 'Static QR codes directly embed the final content (such as a Wi-Fi password or raw text) and cannot be edited after printing. Dynamic QR codes encode a secure redirect link. This lets you update the destination URL at any time without re-printing the QR image, while tracking live scan analytics.'
    },
    {
      q: 'How does Google Sheets store my QR codes and scan analytics?',
      a: 'QR Studio connects directly to your private Google Sheet using a lightweight Google Apps Script Web App backend. Every time a dynamic QR code is created or scanned, details (timestamp, device type, OS, browser, anonymized visitor ID) are appended into your "QRCodes" and "ScanLogs" sheets.'
    },
    {
      q: 'Can I customize colors, dot styles, and embed my company logo?',
      a: 'Yes! QR Studio features an advanced customization engine with 5 dot patterns, linear and radial color gradients, custom corner eye frame shapes, high-resolution logo uploads, and a real-time Scanability Checker to guarantee camera readability.'
    },
    {
      q: 'What image formats can I export my QR code in?',
      a: 'You can instantly export your QR code in high-resolution PNG (for digital graphics), vector SVG (for crisp printing on billboards and merchandise), and PDF print templates.'
    },
    {
      q: 'Is there any subscription fee or scan limit?',
      a: 'No subscription required! QR Studio runs serverless on your Google Workspace or standard Google account. Standard Google Apps Script quotas (~20,000 daily API requests) apply, which is more than enough for most campaigns.'
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 overflow-hidden">
        
        {/* Glowing Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-electric-600/30 to-glow-purple/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center px-4 space-y-8">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/90 light:bg-slate-100 border border-slate-700/80 light:border-slate-300 text-xs font-semibold text-electric-400 light:text-electric-600 shadow-xl backdrop-blur-md animate-float">
            <Sparkles className="w-4 h-4 text-electric-400" />
            <span>Next-Gen QR Studio • {DESIGNER_CREDIT}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans text-white light:text-slate-900 leading-[1.1]">
            Create QR codes that <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-electric-400 via-cyan-400 to-glow-purple bg-clip-text text-transparent">
              work harder.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 light:text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Generate custom dynamic QR codes with live destination editing, high-resolution vector exports, custom dot shapes, and real-time Google Sheets analytics.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentTab('generator')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-electric-600 to-glow-purple hover:from-electric-500 hover:to-purple-600 text-white font-semibold text-base shadow-xl shadow-electric-600/25 hover:shadow-electric-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
            >
              <QrCode className="w-5 h-5" />
              <span>Create QR Code</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-navy-900/80 light:bg-slate-100 hover:bg-navy-800 light:hover:bg-slate-200 border border-slate-700 light:border-slate-300 text-slate-100 light:text-slate-900 font-semibold text-base backdrop-blur-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5 text-electric-400" />
              <span>View Dashboard</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800/80 light:border-slate-200">
            <div className="p-4 rounded-2xl bg-navy-900/40 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 text-center">
              <p className="text-2xl font-bold text-white light:text-slate-900">14</p>
              <p className="text-xs text-slate-400 light:text-slate-600">Content Types</p>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/40 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 text-center">
              <p className="text-2xl font-bold text-white light:text-slate-900">100%</p>
              <p className="text-xs text-slate-400 light:text-slate-600">Google Sheets Sync</p>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/40 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 text-center">
              <p className="text-2xl font-bold text-white light:text-slate-900">3 Formats</p>
              <p className="text-xs text-slate-400 light:text-slate-600">PNG, SVG & PDF</p>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/40 light:bg-slate-50 border border-slate-800/60 light:border-slate-200 text-center">
              <p className="text-2xl font-bold text-white light:text-slate-900">Real-time</p>
              <p className="text-xs text-slate-400 light:text-slate-600">Scan Analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATIC VS DYNAMIC QR COMPARISON MATRIX */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-white light:text-slate-900 font-sans">
            Static vs. Dynamic QR Codes
          </h2>
          <p className="text-slate-400 light:text-slate-600 max-w-xl mx-auto text-sm">
            Choose the right QR architecture for your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Static Card */}
          <div className="p-8 rounded-3xl bg-navy-900/70 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-6 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Static QR Code</span>
            </div>
            <h3 className="text-xl font-bold text-white light:text-slate-900">Direct Content Embedding</h3>
            <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
              Encodes raw target data (such as a Wi-Fi password, vCard contact, or static URL) directly inside the QR matrix. Works offline forever without a server lookup.
            </p>
            <ul className="space-y-3 text-sm text-slate-300 light:text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Works offline without any backend dependency</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ideal for Wi-Fi credentials & vCard contact cards</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-500">
                <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold shrink-0">✕</span>
                <span>Cannot change destination after downloading</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-500">
                <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold shrink-0">✕</span>
                <span>No scan count or location analytics available</span>
              </li>
            </ul>
          </div>

          {/* Dynamic Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-900 to-electric-950/40 light:bg-white border-2 border-electric-500/40 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-electric-600 text-white text-[11px] font-bold uppercase tracking-wider">
              Recommended
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/20 text-electric-300 text-xs font-semibold border border-electric-500/30">
              <RefreshCw className="w-3.5 h-3.5 text-electric-400 animate-spin-slow" />
              <span>Dynamic QR Code</span>
            </div>
            <h3 className="text-xl font-bold text-white light:text-slate-900">Editable Destination & Analytics</h3>
            <p className="text-sm text-slate-300 light:text-slate-600 leading-relaxed">
              Encodes a stable Google Apps Script redirect URL. Change where the QR points at any time without re-printing posters, and track total scans, devices, OS, and referrers.
            </p>
            <ul className="space-y-3 text-sm text-slate-200 light:text-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0" />
                <span className="font-semibold text-white light:text-slate-900">Edit target URL anytime without re-printing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0" />
                <span>Track live total scans & unique visitor counts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0" />
                <span>Set active/pause status, scan limits & expiration dates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0" />
                <span>Stored automatically in your Google Sheet</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHT CARDS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-white light:text-slate-900 font-sans">
            Engineered for Modern Campaigns
          </h2>
          <p className="text-slate-400 light:text-slate-600 max-w-xl mx-auto text-sm">
            Everything you need to create, style, test, and measure QR performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-navy-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-3 hover:border-electric-500/50 transition-colors">
            <div className="p-3 rounded-xl bg-electric-500/10 text-electric-400 w-fit">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white light:text-slate-900">14 Content Formats</h3>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Support for URLs, vCards, Wi-Fi passwords, WhatsApp messages, UPI payment codes, iCal events, Google Maps, and PDF file downloads.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-3 hover:border-electric-500/50 transition-colors">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white light:text-slate-900">Deep Customization</h3>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Choose from 5 dot patterns, linear/radial gradients, custom corner eye frame styles, background contrast tuning, and logo embedding.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-3 hover:border-electric-500/50 transition-colors">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white light:text-slate-900">Scanability Safety Check</h3>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Real-time algorithm checks contrast ratios, logo dimensions, and error correction levels to warn you before printing broken codes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-3 hover:border-electric-500/50 transition-colors">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white light:text-slate-900">Google Sheets Database</h3>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Zero third-party database fees. Uses Google Apps Script to write records directly to your personal Google Sheet with lock concurrency.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-3 hover:border-electric-500/50 transition-colors">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 w-fit">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white light:text-slate-900">Device & OS Analytics</h3>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Track scan counts by day, device category (Mobile/Desktop), Operating System, Browser, and referrers with CSV export.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-3 hover:border-electric-500/50 transition-colors">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white light:text-slate-900">Vector SVG & Print PDF</h3>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Download crisp, infinite-scale SVG graphics for physical print shop production, high-density PNGs, or styled PDF cards.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-white light:text-slate-900 font-sans">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 light:text-slate-600 text-sm">
            Everything you need to know about QR Studio architecture.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-navy-900/70 light:bg-slate-50 border border-slate-800 light:border-slate-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-white light:text-slate-900 text-sm sm:text-base hover:bg-slate-800/50 light:hover:bg-slate-200/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-electric-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-2 text-sm text-slate-300 light:text-slate-600 leading-relaxed border-t border-slate-800/40 light:border-slate-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-electric-700 via-electric-600 to-glow-purple text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans">
              Ready to Launch Your QR Campaign?
            </h2>
            <p className="text-electric-100 text-sm sm:text-base">
              Create your first custom dynamic QR code in less than 60 seconds.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('generator')}
            className="px-8 py-4 rounded-2xl bg-white text-navy-950 hover:bg-slate-100 font-bold text-base shadow-xl hover:scale-[1.02] transition-transform inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-electric-600" />
            <span>Launch QR Generator</span>
          </button>
        </div>
      </section>

    </div>
  );
};
