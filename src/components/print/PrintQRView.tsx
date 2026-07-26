import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useApp } from '../../context/AppContext';
import { Printer, X, Download } from 'lucide-react';
import { DESIGNER_CREDIT, APP_NAME } from '../../config/appConfig';

export const PrintQRView: React.FC = () => {
  const { printRecord, closePrint } = useApp();
  const printContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!printRecord) return;

    // ALWAYS ENCODE EXACT TARGET URL / DATA
    const exactContent = printRecord.destinationUrl || printRecord.staticContent || 'https://qrstudio.app';

    const qr = new QRCodeStyling({
      width: 320,
      height: 320,
      data: exactContent,
      margin: printRecord.customizationJson?.margin || 10,
      dotsOptions: {
        color: printRecord.customizationJson?.dotsColor || '#000000',
        type: printRecord.customizationJson?.dotsStyle || 'square',
      },
      backgroundOptions: {
        color: printRecord.customizationJson?.bgColor || '#ffffff',
      },
      cornersSquareOptions: {
        color: printRecord.customizationJson?.cornerSquareColor || '#000000',
        type: printRecord.customizationJson?.cornerSquareStyle || 'square',
      },
      cornersDotOptions: {
        color: printRecord.customizationJson?.cornerDotColor || '#000000',
        type: printRecord.customizationJson?.cornerDotStyle || 'square',
      },
      image: printRecord.customizationJson?.logoUrl || undefined,
      imageOptions: {
        imageSize: printRecord.customizationJson?.logoSizeRatio || 0.2,
        margin: 4,
      }
    });

    if (printContainerRef.current) {
      printContainerRef.current.innerHTML = '';
      qr.append(printContainerRef.current);
    }
  }, [printRecord]);

  if (!printRecord) return null;

  const handleExecutePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Print Controls Top Bar */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 print:hidden">
        <button
          onClick={handleExecutePrint}
          className="px-6 py-3 rounded-2xl bg-electric-600 hover:bg-electric-500 text-white font-bold text-sm shadow-2xl flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Page</span>
        </button>
        <button
          onClick={closePrint}
          className="p-3 rounded-2xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet Card */}
      <div className="w-full max-w-lg rounded-3xl bg-white text-slate-900 shadow-2xl p-8 sm:p-12 space-y-8 text-center border border-slate-200 print:shadow-none print:border-none print:max-w-none print:w-full print:h-screen print:flex print:flex-col print:justify-center">
        
        {/* Brand Header */}
        <div className="space-y-1 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold font-sans text-slate-900 tracking-tight">{APP_NAME}</h1>
          <p className="text-xs text-slate-500 font-medium">{DESIGNER_CREDIT}</p>
        </div>

        {/* QR Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">{printRecord.qrName}</h2>
          <p className="text-xs text-slate-500 font-mono truncate max-w-sm mx-auto">
            {printRecord.destinationUrl || printRecord.staticContent}
          </p>
        </div>

        {/* Scaled QR Graphic Container */}
        <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 w-fit mx-auto shadow-inner">
          <div ref={printContainerRef} className="flex items-center justify-center" />
        </div>

        {/* Instruction Footer */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Point Camera to Scan QR Code
          </p>
          <p className="text-xs text-slate-500">
            Generated via QR Studio • {DESIGNER_CREDIT}
          </p>
        </div>

      </div>
    </div>
  );
};
