import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import jsPDF from 'jspdf';
import { QRCustomization, QRType } from '../../types';
import { checkScanability, ScanabilityReport } from '../../services/scanabilityChecker';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Copy,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Share2,
  FileCode,
  FileImage,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface QRPreviewCardProps {
  content: string;
  qrType: QRType;
  qrName: string;
  customization: QRCustomization;
  onSave?: () => void;
  isSaving?: boolean;
}

export const QRPreviewCard: React.FC<QRPreviewCardProps> = ({
  content,
  qrType,
  qrName,
  customization,
  onSave,
  isSaving = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const { addToast, triggerPrint } = useApp();
  const [report, setReport] = useState<ScanabilityReport | null>(null);

  // Initialize and update QRCodeStyling
  useEffect(() => {
    const rawTarget = content || 'https://qrstudio.app';

    // Check Scanability
    const healthReport = checkScanability(customization, rawTarget);
    setReport(healthReport);

    const options: any = {
      width: customization.size || 300,
      height: customization.size || 300,
      type: 'svg',
      data: rawTarget,
      margin: customization.margin || 10,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: customization.errorCorrectionLevel || 'M',
      },
      imageOptions: {
        hideBackgroundDots: customization.hideBackgroundDotsWithLogo ?? true,
        imageSize: customization.logoSizeRatio || 0.2,
        margin: 4,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        color: customization.dotsColor || '#000000',
        type: customization.dotsStyle || 'square',
      },
      backgroundOptions: {
        color: customization.bgColor || '#ffffff',
      },
      cornersSquareOptions: {
        color: customization.cornerSquareColor || customization.dotsColor || '#000000',
        type: customization.cornerSquareStyle || 'square',
      },
      cornersDotOptions: {
        color: customization.cornerDotColor || customization.cornerSquareColor || customization.dotsColor || '#000000',
        type: customization.cornerDotStyle || 'square',
      },
    };

    if (customization.dotsGradientEnabled) {
      options.dotsOptions.gradient = {
        type: customization.dotsGradientType || 'linear',
        rotation: (customization.dotsGradientRotation || 45) * (Math.PI / 180),
        colorStops: [
          { offset: 0, color: customization.dotsColor },
          { offset: 1, color: customization.dotsGradientColor2 || '#3B82F6' },
        ],
      };
    }

    if (customization.logoUrl) {
      options.image = customization.logoUrl;
    } else {
      options.image = '';
    }

    if (!qrCodeInstanceRef.current) {
      qrCodeInstanceRef.current = new QRCodeStyling(options);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrCodeInstanceRef.current.append(containerRef.current);
      }
    } else {
      qrCodeInstanceRef.current.update(options);
    }
  }, [content, customization]);

  // Export handlers
  const handleDownloadPNG = () => {
    if (qrCodeInstanceRef.current) {
      qrCodeInstanceRef.current.download({
        name: `${qrName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr`,
        extension: 'png',
      });
      addToast('Downloaded high-resolution PNG QR Code', 'success');
    }
  };

  const handleDownloadSVG = () => {
    if (qrCodeInstanceRef.current) {
      qrCodeInstanceRef.current.download({
        name: `${qrName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr`,
        extension: 'svg',
      });
      addToast('Downloaded scalable vector SVG QR Code', 'success');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!qrCodeInstanceRef.current) return;
      const blob = await qrCodeInstanceRef.current.getRawData('png');
      if (!blob) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const imgData = e.target?.result as string;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        // Add Header
        pdf.setFillColor(11, 15, 25);
        pdf.rect(0, 0, 210, 30, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        pdf.text('QR Studio', 15, 18);

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Designed by Arasukirubanandhan', 15, 24);

        // QR Title
        pdf.setTextColor(15, 23, 42);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(qrName || 'Untitled QR Code', 105, 55, { align: 'center' });

        // QR Image
        pdf.addImage(imgData, 'PNG', 55, 65, 100, 100);

        // Scan Instructions Box
        pdf.setDrawColor(226, 232, 240);
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(35, 175, 140, 35, 4, 4, 'FD');

        pdf.setTextColor(30, 41, 59);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SCAN ME WITH YOUR PHONE CAMERA', 105, 186, { align: 'center' });

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Type: ${qrType.toUpperCase()} | Created via QR Studio`, 105, 194, { align: 'center' });
        pdf.text(`Destination: ${content.substring(0, 50)}...`, 105, 200, { align: 'center' });

        // Footer
        pdf.setFontSize(8);
        pdf.text('Generated with QR Studio • Designed by Arasukirubanandhan', 105, 280, { align: 'center' });

        pdf.save(`${qrName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr.pdf`);
        addToast('Downloaded print-ready PDF document', 'success');
      };
      reader.readAsDataURL(blob as Blob);
    } catch (err) {
      addToast('Error generating PDF document', 'error');
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    addToast('Copied content to clipboard!', 'success');
  };

  const handlePrintPreview = () => {
    triggerPrint({
      id: 'preview_temp',
      qrName: qrName || 'QR Code Preview',
      qrType: qrType,
      contentType: 'url',
      staticContent: content,
      destinationUrl: content,
      shortRedirectUrl: content,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      customizationJson: customization,
      totalScans: 0,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* PREVIEW CONTAINER CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900/90 light:bg-white border border-slate-800 light:border-slate-200 shadow-2xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
        
        {/* QR Type Badge */}
        <div className="flex items-center justify-between w-full">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            qrType === 'dynamic'
              ? 'bg-electric-500/20 text-electric-300 border border-electric-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}>
            {qrType === 'dynamic' ? '⚡ Dynamic QR' : '🔒 Static QR'}
          </span>
          <button
            onClick={handleCopyContent}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>
        </div>

        {/* Dynamic Canvas Container */}
        <div className="relative p-4 rounded-2xl bg-white shadow-xl border border-slate-200 flex items-center justify-center min-w-[280px] min-h-[280px]">
          <div ref={containerRef} className="flex items-center justify-center" />
        </div>

        {/* Content Snippet */}
        <div className="w-full text-center space-y-1">
          <p className="text-sm font-bold text-white light:text-slate-900 truncate px-4">{qrName || 'Untitled QR Code'}</p>
          <p className="text-xs text-slate-400 font-mono truncate max-w-xs mx-auto">{content || 'https://qrstudio.app'}</p>
        </div>

        {/* Primary Save Button */}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-electric-600 to-glow-purple hover:from-electric-500 hover:to-purple-600 text-white font-bold text-sm shadow-xl shadow-electric-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSaving ? 'Saving Record...' : 'Save & Publish QR Record'}</span>
          </button>
        )}
      </div>

      {/* DOWNLOAD & EXPORT OPTIONS */}
      <div className="p-6 rounded-2xl bg-navy-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-4">
        <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">
          Export & Print Options
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={handleDownloadPNG}
            className="p-3 rounded-xl bg-navy-950 light:bg-white border border-slate-800 light:border-slate-200 hover:border-electric-500 text-slate-200 light:text-slate-800 hover:text-white flex flex-col items-center gap-1.5 text-xs font-semibold transition-all"
          >
            <FileImage className="w-4 h-4 text-electric-400" />
            <span>PNG Image</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            className="p-3 rounded-xl bg-navy-950 light:bg-white border border-slate-800 light:border-slate-200 hover:border-electric-500 text-slate-200 light:text-slate-800 hover:text-white flex flex-col items-center gap-1.5 text-xs font-semibold transition-all"
          >
            <FileCode className="w-4 h-4 text-purple-400" />
            <span>Vector SVG</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="p-3 rounded-xl bg-navy-950 light:bg-white border border-slate-800 light:border-slate-200 hover:border-electric-500 text-slate-200 light:text-slate-800 hover:text-white flex flex-col items-center gap-1.5 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>PDF Card</span>
          </button>

          <button
            onClick={handlePrintPreview}
            className="p-3 rounded-xl bg-navy-950 light:bg-white border border-slate-800 light:border-slate-200 hover:border-electric-500 text-slate-200 light:text-slate-800 hover:text-white flex flex-col items-center gap-1.5 text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* REAL-TIME SCANABILITY CHECKER REPORT */}
      {report && (
        <div className="p-5 rounded-2xl bg-navy-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-5 h-5 ${
                report.score >= 80 ? 'text-emerald-400' : report.score >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`} />
              <h4 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider">
                Scanability Health Checker
              </h4>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
              report.score >= 80 ? 'bg-emerald-500/20 text-emerald-300' : report.score >= 50 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {report.score}% • {report.level}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                report.score >= 80 ? 'bg-emerald-400' : report.score >= 50 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${report.score}%` }}
            />
          </div>

          {report.warnings.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              {report.warnings.map((warn, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-300 light:text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Great job! High contrast & clear geometry for 100% camera readability.</span>
            </p>
          )}
        </div>
      )}

    </div>
  );
};
