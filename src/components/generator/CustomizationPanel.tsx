import React from 'react';
import { QRCustomization, DotStyleType, CornerSquareStyleType, CornerDotStyleType } from '../../types';
import { PRESET_TEMPLATES } from '../../config/appConfig';
import {
  Palette,
  Upload,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Sliders,
  Check,
  Grid,
  Maximize2
} from 'lucide-react';

interface CustomizationPanelProps {
  customization: QRCustomization;
  onChange: (updated: Partial<QRCustomization>) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  onChange,
}) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller logo image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target?.result as string;
        onChange({
          logoUrl,
          // Auto recommend Error Correction H when logo is attached
          errorCorrectionLevel: customization.errorCorrectionLevel === 'L' || customization.errorCorrectionLevel === 'M' ? 'H' : customization.errorCorrectionLevel
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange({ logoUrl: '' });
  };

  const applyPreset = (presetCustomization: Partial<QRCustomization>) => {
    onChange(presetCustomization);
  };

  const dotStyles: { id: DotStyleType; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'dots', label: 'Dots' },
    { id: 'classy', label: 'Classy' },
    { id: 'extra-rounded', label: 'Extra Smooth' },
  ];

  const cornerSquareStyles: { id: CornerSquareStyleType; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'extra-rounded', label: 'Rounded' },
    { id: 'dot', label: 'Circular' },
  ];

  return (
    <div className="space-y-8">
      
      {/* QUICK PRESETS */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-electric-400" />
          <span>Design Presets</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PRESET_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => applyPreset(tmpl.customization)}
              className="p-3 rounded-xl bg-navy-950/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 hover:border-electric-500 light:hover:border-electric-500 text-left transition-all group"
            >
              <p className="text-xs font-bold text-white light:text-slate-900 group-hover:text-electric-400 transition-colors">
                {tmpl.name}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{tmpl.category}</p>
            </button>
          ))}
        </div>
      </div>

      {/* DOT STYLES */}
      <div className="space-y-3 border-t border-slate-800/80 light:border-slate-200 pt-6">
        <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">
          Pattern Dot Shapes
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {dotStyles.map((st) => (
            <button
              key={st.id}
              onClick={() => onChange({ dotsStyle: st.id })}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                customization.dotsStyle === st.id
                  ? 'bg-electric-600 text-white border-electric-500 shadow-md'
                  : 'bg-navy-950 light:bg-slate-100 text-slate-300 light:text-slate-700 border-slate-800 light:border-slate-300 hover:border-slate-600'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* COLOR & GRADIENT CONTROLS */}
      <div className="space-y-4 border-t border-slate-800/80 light:border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">
            Foreground Dot Color & Gradient
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={customization.dotsGradientEnabled}
              onChange={(e) => onChange({ dotsGradientEnabled: e.target.checked })}
              className="rounded border-slate-700 text-electric-600 focus:ring-electric-500 h-4 w-4"
            />
            <span className="text-xs text-slate-300 light:text-slate-700 font-medium">Enable Gradient</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">Primary Dot Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customization.dotsColor}
                onChange={(e) => onChange({ dotsColor: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-700 bg-transparent p-1"
              />
              <input
                type="text"
                value={customization.dotsColor}
                onChange={(e) => onChange({ dotsColor: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs uppercase font-mono"
              />
            </div>
          </div>

          {customization.dotsGradientEnabled && (
            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5">Secondary Gradient Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customization.dotsGradientColor2}
                  onChange={(e) => onChange({ dotsGradientColor2: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-700 bg-transparent p-1"
                />
                <input
                  type="text"
                  value={customization.dotsGradientColor2}
                  onChange={(e) => onChange({ dotsGradientColor2: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs uppercase font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Background Color */}
        <div className="pt-2">
          <label className="block text-[11px] text-slate-400 mb-1.5">Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customization.bgColor}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-700 bg-transparent p-1"
            />
            <input
              type="text"
              value={customization.bgColor}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs uppercase font-mono"
            />
          </div>
        </div>
      </div>

      {/* CORNER EYE STYLES */}
      <div className="space-y-4 border-t border-slate-800/80 light:border-slate-200 pt-6">
        <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">
          Corner Eye Frames & Colors
        </label>
        
        <div className="grid grid-cols-3 gap-2">
          {cornerSquareStyles.map((st) => (
            <button
              key={st.id}
              onClick={() => onChange({ cornerSquareStyle: st.id })}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                customization.cornerSquareStyle === st.id
                  ? 'bg-electric-600 text-white border-electric-500'
                  : 'bg-navy-950 light:bg-slate-100 text-slate-300 light:text-slate-700 border-slate-800 light:border-slate-300'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Corner Eye Frame Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customization.cornerSquareColor}
                onChange={(e) => onChange({ cornerSquareColor: e.target.value, cornerDotColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-1"
              />
              <span className="text-xs font-mono text-slate-300 uppercase">{customization.cornerSquareColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTERED LOGO UPLOAD & SAFE-SIZE WARNING */}
      <div className="space-y-4 border-t border-slate-800/80 light:border-slate-200 pt-6">
        <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">
          Centered Brand Logo
        </label>

        {customization.logoUrl ? (
          <div className="p-4 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-800 light:border-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={customization.logoUrl} alt="Uploaded logo preview" className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-slate-200" />
              <div>
                <p className="text-xs font-bold text-white light:text-slate-900">Custom Logo Embedded</p>
                <p className="text-[10px] text-slate-400">Scale: {Math.round(customization.logoSizeRatio * 100)}%</p>
              </div>
            </div>
            <button
              onClick={removeLogo}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-700 light:border-slate-300 hover:border-electric-500 bg-navy-950/50 light:bg-slate-50 cursor-pointer transition-colors text-center space-y-2">
            <Upload className="w-6 h-6 text-electric-400" />
            <span className="text-xs font-semibold text-slate-200 light:text-slate-800">Upload Logo Image</span>
            <span className="text-[10px] text-slate-400">PNG, SVG, or JPG (Max 2MB)</span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        )}

        {customization.logoUrl && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Logo Size Scale</span>
              <span>{Math.round(customization.logoSizeRatio * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.35"
              step="0.02"
              value={customization.logoSizeRatio}
              onChange={(e) => onChange({ logoSizeRatio: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-electric-500"
            />

            {customization.logoSizeRatio > 0.25 && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong>Safe-Size Warning:</strong> Logo ratio is greater than 25%. This may obscure too many QR modules. We recommend keeping logo size below 25% and using 'High' Error Correction.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ERROR CORRECTION & ADVANCED SETTINGS */}
      <div className="space-y-4 border-t border-slate-800/80 light:border-slate-200 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Error Correction Level
            </label>
            <select
              value={customization.errorCorrectionLevel}
              onChange={(e) => onChange({ errorCorrectionLevel: e.target.value as any })}
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-electric-500 text-xs"
            >
              <option value="L">L - Low (7% damage recovery)</option>
              <option value="M">M - Medium (15% damage recovery)</option>
              <option value="Q">Q - Quartile (25% damage recovery)</option>
              <option value="H">H - High (30% damage recovery - Best for Logos)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
              Quiet Zone Margin
            </label>
            <input
              type="number"
              min="0"
              max="40"
              value={customization.margin}
              onChange={(e) => onChange({ margin: parseInt(e.target.value) || 0 })}
              className="w-full p-3 rounded-xl bg-navy-950 light:bg-slate-100 border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-electric-500 text-xs"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
