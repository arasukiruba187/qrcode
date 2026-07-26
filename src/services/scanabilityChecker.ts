import { QRCustomization } from '../types';

export interface ScanabilityReport {
  score: number; // 0 to 100
  level: 'Excellent' | 'Good' | 'Warning' | 'Poor';
  contrastRatio: number;
  warnings: string[];
  tips: string[];
}

/**
 * Calculates WCAG luminance of hex color
 */
function getLuminance(hex: string): number {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculate contrast ratio between two hex colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  try {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
  } catch (err) {
    return 4.5;
  }
}

/**
 * Analyzes QR customization and content to produce a scanability health report
 */
export function checkScanability(customization: QRCustomization, rawContent: string): ScanabilityReport {
  const warnings: string[] = [];
  const tips: string[] = [];
  let score = 100;

  // 1. Contrast Check
  const contrast = calculateContrastRatio(customization.dotsColor, customization.bgColor);
  if (contrast < 2.5) {
    score -= 40;
    warnings.push(`Extremely low color contrast ratio (${contrast}:1). Cameras will fail to read this QR code.`);
    tips.push('Increase contrast by using a much darker dot color or lighter background.');
  } else if (contrast < 4.5) {
    score -= 20;
    warnings.push(`Moderate color contrast ratio (${contrast}:1). May have difficulty scanning in low light.`);
    tips.push('Recommended contrast ratio is at least 4.5:1 for optimal scanning.');
  }

  // 2. Color Inversion Check (Dark bg with Light dots)
  const bgLum = getLuminance(customization.bgColor);
  const dotLum = getLuminance(customization.dotsColor);
  if (bgLum < dotLum) {
    score -= 15;
    warnings.push('Inverted color scheme detected (light dots on dark background). Some legacy QR scanners cannot read inverted codes.');
    tips.push('For universal compatibility, use dark foreground dots on a light background.');
  }

  // 3. Logo & Error Correction Level
  if (customization.logoUrl) {
    if (customization.logoSizeRatio > 0.25) {
      score -= 20;
      warnings.push(`Logo size is large (${Math.round(customization.logoSizeRatio * 100)}% of QR width). It covers too many data modules.`);
      tips.push('Reduce logo size ratio below 25% to protect data integrity.');
    }

    if (customization.errorCorrectionLevel === 'L' || customization.errorCorrectionLevel === 'M') {
      score -= 15;
      warnings.push(`Error correction is set to '${customization.errorCorrectionLevel}'. With a logo attached, 'Q' or 'H' error correction is required.`);
      tips.push("Switch Error Correction Level to 'H' (High - 30% recovery) when embedding a logo.");
    }
  }

  // 4. Data Density Check
  if (rawContent.length > 300) {
    score -= 10;
    warnings.push(`High data volume (${rawContent.length} characters). Static QR matrix will be dense with very small dots.`);
    tips.push('Consider using a Dynamic QR code to keep the QR code simple, robust, and easy to scan from a distance.');
  }

  // Final score clamping
  score = Math.max(0, Math.min(100, score));

  let level: ScanabilityReport['level'] = 'Excellent';
  if (score < 40) level = 'Poor';
  else if (score < 70) level = 'Warning';
  else if (score < 90) level = 'Good';

  return {
    score,
    level,
    contrastRatio: contrast,
    warnings,
    tips,
  };
}
