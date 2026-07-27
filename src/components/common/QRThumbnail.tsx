import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRCodeRecord, QRCustomization } from '../../types';

interface QRThumbnailProps {
  record: QRCodeRecord;
  size?: number;
  className?: string;
}

export const QRThumbnail: React.FC<QRThumbnailProps> = ({ record, size = 140, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const dataUrl = record.qrType === 'dynamic'
      ? (record.shortRedirectUrl || record.destinationUrl || 'https://qrstudio.app')
      : (record.staticContent || record.destinationUrl || 'https://qrstudio.app');

    const customization: QRCustomization = record.customizationJson || {};

    const qr = new QRCodeStyling({
      width: size,
      height: size,
      data: dataUrl,
      margin: 4,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: customization.errorCorrectionLevel || 'L'
      },
      dotsOptions: {
        color: customization.dotsColor || '#0F172A',
        type: customization.dotsStyle || 'square'
      },
      backgroundOptions: {
        color: customization.bgColor || '#FFFFFF'
      },
      cornersSquareOptions: {
        color: customization.cornerSquareColor || customization.dotsColor || '#0F172A',
        type: customization.cornerSquareStyle || 'square'
      },
      cornersDotOptions: {
        color: customization.cornerDotColor || customization.cornerSquareColor || '#0F172A',
        type: customization.cornerDotStyle || 'square'
      },
      image: customization.logoUrl || undefined,
      imageOptions: {
        imageSize: customization.logoSizeRatio || 0.2,
        margin: 2
      }
    });

    containerRef.current.innerHTML = '';
    qr.append(containerRef.current);
  }, [record, size]);

  return (
    <div className={`flex items-center justify-center p-2 rounded-2xl bg-white border border-slate-200 shadow-sm ${className}`}>
      <div ref={containerRef} className="flex items-center justify-center" />
    </div>
  );
};
