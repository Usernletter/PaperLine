import React, { useState, useEffect } from 'react';
import { PatternType, PageSize, Unit, Margins } from '../types';
import { PAGE_SIZES, PATTERN_TYPES, MM_PER_INCH } from '../constants';

interface ControlsProps {
  pattern: PatternType;
  setPattern: (pattern: PatternType) => void;
  pageSize: PageSize;
  setPageSize: (size: PageSize) => void;
  customSize: { width: number; height: number };
  setCustomSize: (size: { width: number; height: number }) => void;
  orientation: 'portrait' | 'landscape';
  setOrientation: (orientation: 'portrait' | 'landscape') => void;
  spacing: number;
  setSpacing: (spacing: number) => void;
  units: Unit;
  setUnits: (unit: Unit) => void;
  color: string;
  setColor: (color: string) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  numberOfPages: number;
  setNumberOfPages: (pages: number) => void;
  margin: Margins;
  setMargin: (margin: Margins) => void;
}

const Controls: React.FC<ControlsProps> = ({
  pattern,
  setPattern,
  pageSize,
  setPageSize,
  customSize,
  setCustomSize,
  orientation,
  setOrientation,
  spacing,
  setSpacing,
  units,
  setUnits,
  color,
  setColor,
  opacity,
  setOpacity,
  lineThickness,
  setLineThickness,
  onPrint,
  onDownloadPdf,
  numberOfPages,
  setNumberOfPages,
  margin,
  setMargin,
}) => {
  // Spacing controls
  const spacingInUnits = units === 'mm' ? spacing : spacing / MM_PER_INCH;
  const maxSpacing = units === 'mm' ? 50 : 2;
  const minSpacing = units === 'mm' ? 1 : 0.05;
  const step = units === 'mm' ? 1 : 0.05;

  const getFormattedValue = (value: number, unit: Unit) => {
    return unit === 'mm' ? value.toFixed(0) : value.toFixed(2);
  };
  
  const [localSpacingStr, setLocalSpacingStr] = useState(getFormattedValue(spacingInUnits, units));

  // Custom size controls
  const customWidthInUnits = units === 'mm' ? customSize.width : customSize.width / MM_PER_INCH;
  const customHeightInUnits = units === 'mm' ? customSize.height : customSize.height / MM_PER_INCH;
  const [localWidthStr, setLocalWidthStr] = useState(getFormattedValue(customWidthInUnits, units));
  const [localHeightStr, setLocalHeightStr] = useState(getFormattedValue(customHeightInUnits, units));

  // Margin controls
  const maxMargin = units === 'mm' ? 50 : 2;
  const minMargin = 0;
  const marginStep = units === 'mm' ? 1 : 0.05;
  
  const [localMarginsStr, setLocalMarginsStr] = useState({
    top: getFormattedValue(units === 'mm' ? margin.top : margin.top / MM_PER_INCH, units),
    right: getFormattedValue(units === 'mm' ? margin.right : margin.right / MM_PER_INCH, units),
    bottom: getFormattedValue(units === 'mm' ? margin.bottom : margin.bottom / MM_PER_INCH, units),
    left: getFormattedValue(units === 'mm' ? margin.left : margin.left / MM_PER_INCH, units),
  });

  useEffect(() => {
    setLocalSpacingStr(getFormattedValue(spacingInUnits, units));
  }, [spacing, units]);

  useEffect(() => {
    setLocalWidthStr(getFormattedValue(customWidthInUnits, units));
    setLocalHeightStr(getFormattedValue(customHeightInUnits, units));
  }, [customSize, units]);

  useEffect(() => {
    setLocalMarginsStr({
        top: getFormattedValue(units === 'mm' ? margin.top : margin.top / MM_PER_INCH, units),
        right: getFormattedValue(units === 'mm' ? margin.right : margin.right / MM_PER_INCH, units),
        bottom: getFormattedValue(units === 'mm' ? margin.bottom : margin.bottom / MM_PER_INCH, units),
        left: getFormattedValue(units === 'mm' ? margin.left : margin.left / MM_PER_INCH, units),
    })
  }, [margin, units]);

  const handleSpacingSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInUnits = parseFloat(e.target.value);
    const valueInMm = units === 'mm' ? valueInUnits : valueInUnits * MM_PER_INCH;
    setSpacing(valueInMm);
  };

  const handleSpacingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSpacingStr(e.target.value);
  };

  const handleSpacingInputBlur = () => {
    let valueInUnits = parseFloat(localSpacingStr);
    if (!isNaN(valueInUnits)) {
      valueInUnits = Math.max(minSpacing, Math.min(valueInUnits, maxSpacing));
      const valueInMm = units === 'mm' ? valueInUnits : valueInUnits * MM_PER_INCH;
      setSpacing(valueInMm);
    } else {
      setLocalSpacingStr(getFormattedValue(spacingInUnits, units));
    }
  };
  
  const handleCustomDimChange = (
    valueStr: string, 
    dimension: 'width' | 'height', 
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
      setter(valueStr);
      let valueInUnits = parseFloat(valueStr);
      if (!isNaN(valueInUnits)) {
          const valueInMm = units === 'mm' ? valueInUnits : valueInUnits * MM_PER_INCH;
          setCustomSize({ ...customSize, [dimension]: valueInMm });
      }
  }

  const handleUnitChange = (newUnit: Unit) => {
    if (newUnit !== units) {
        setUnits(newUnit);
    }
  };
  
  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    if (value > 250) value = 250;
    setNumberOfPages(value);
  };

  const handleMarginChange = (side: keyof Margins, valueStr: string, isSlider: boolean = false) => {
    let valueInUnits: number;

    if (isSlider) {
        valueInUnits = parseFloat(valueStr);
    } else {
        setLocalMarginsStr(prev => ({ ...prev, [side]: valueStr }));
        valueInUnits = parseFloat(valueStr);
    }

    if (!isNaN(valueInUnits)) {
        const validatedValue = Math.max(minMargin, Math.min(valueInUnits, maxMargin));
        const valueInMm = units === 'mm' ? validatedValue : validatedValue * MM_PER_INCH;
        setMargin({ ...margin, [side]: valueInMm });
    }
  };

  const handleMarginInputBlur = (side: keyof Margins) => {
    const marginInUnits = units === 'mm' ? margin[side] : margin[side] / MM_PER_INCH;
    let valueInUnits = parseFloat(localMarginsStr[side]);
    if (isNaN(valueInUnits)) {
        setLocalMarginsStr(prev => ({...prev, [side]: getFormattedValue(marginInUnits, units)}));
    }
  };

  const showLineThicknessControl = ['graph', 'lines', 'hexagons', 'music'].includes(pattern.id);
  
  return (
    <aside className="w-full md:w-80 lg:w-96 bg-white p-8 shadow-lg print:hidden">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Paper Line</h1>
          <p className="text-gray-500 mt-1">Generate custom printable paper</p>
        </header>

        {/* Pattern Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
          <div className="grid grid-cols-2 gap-2">
            {PATTERN_TYPES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPattern(p)}
                className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                  pattern.id === p.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Page Size and Orientation */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="page-size" className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                <select
                    id="page-size"
                    value={pageSize.name}
                    onChange={(e) => setPageSize(PAGE_SIZES.find(p => p.name === e.target.value)!)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {PAGE_SIZES.map(p => <option key={p.name}>{p.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                <div className="flex rounded-md shadow-sm">
                    <button onClick={() => setOrientation('portrait')} className={`px-4 py-2 text-sm flex-1 rounded-l-md ${orientation === 'portrait' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50 border border-gray-300'}`}>Portrait</button>
                    <button onClick={() => setOrientation('landscape')} className={`px-4 py-2 text-sm flex-1 rounded-r-md -ml-px ${orientation === 'landscape' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50 border border-gray-300'}`}>Landscape</button>
                </div>
            </div>
        </div>

        {/* Custom Page Size */}
        {pageSize.name === 'Custom' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                    <label htmlFor="custom-width" className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                    <div className="relative">
                       <input 
                         id="custom-width"
                         type="number"
                         value={localWidthStr}
                         onChange={(e) => handleCustomDimChange(e.target.value, 'width', setLocalWidthStr)}
                         onBlur={() => setLocalWidthStr(getFormattedValue(customWidthInUnits, units))}
                         className="w-full border-gray-300 rounded-md shadow-sm text-right pr-10"
                       />
                       <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">{units}</span>
                    </div>
                </div>
                 <div>
                    <label htmlFor="custom-height" className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                     <div className="relative">
                       <input 
                         id="custom-height"
                         type="number"
                         value={localHeightStr}
                         onChange={(e) => handleCustomDimChange(e.target.value, 'height', setLocalHeightStr)}
                         onBlur={() => setLocalHeightStr(getFormattedValue(customHeightInUnits, units))}
                         className="w-full border-gray-300 rounded-md shadow-sm text-right pr-10"
                       />
                       <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">{units}</span>
                    </div>
                </div>
            </div>
        )}

        {/* Color */}
        <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">Line Color</label>
            <div className="flex items-center gap-2">
              <input 
                id="color"
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
              />
              <span className="text-gray-600 font-mono text-sm">{color}</span>
            </div>
        </div>

        {/* Spacing and Units */}
        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="spacing-input" className="block text-sm font-medium text-gray-700">Spacing</label>
                 <div className="flex rounded-md shadow-sm">
                    <button onClick={() => handleUnitChange('mm')} className={`px-3 py-1 text-sm rounded-l-md ${units === 'mm' ? 'bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 border border-gray-300'}`}>Millimeters</button>
                    <button onClick={() => handleUnitChange('in')} className={`px-3 py-1 text-sm rounded-r-md -ml-px ${units === 'in' ? 'bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 border border-gray-300'}`}>Inches</button>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <input
                    id="spacing-range"
                    type="range"
                    min={minSpacing}
                    max={maxSpacing}
                    step={step}
                    value={spacingInUnits}
                    onChange={handleSpacingSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="relative w-28">
                    <input
                        id="spacing-input"
                        type="number"
                        min={minSpacing}
                        max={maxSpacing}
                        step={step}
                        value={localSpacingStr}
                        onChange={handleSpacingInputChange}
                        onBlur={handleSpacingInputBlur}
                        className="w-full border-gray-300 rounded-md shadow-sm text-right pr-10"
                        onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }}
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">{units}</span>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
                Vertical distance between lines.
            </p>
        </div>
        
        {/* Transparency */}
        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="opacity" className="block text-sm font-medium text-gray-700">Transparency</label>
                <span className="text-gray-500 text-sm font-semibold">{Math.round(opacity * 100)}%</span>
            </div>
            <input
                id="opacity"
                type="range"
                min="0.05"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        {/* Line Thickness */}
        {showLineThicknessControl && (
          <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="line-thickness" className="block text-sm font-medium text-gray-700">Line/Dot Size</label>
                <span className="text-gray-500 text-sm font-semibold">{Math.round(lineThickness * 100)}%</span>
            </div>
            <input
                id="line-thickness"
                type="range"
                min="0.01"
                max="0.1"
                step="0.005"
                value={lineThickness}
                onChange={(e) => setLineThickness(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
             <p className="text-xs text-gray-500 mt-1">
                Relative to spacing.
            </p>
          </div>
        )}

        {/* Page Margin */}
        <div>
            <h3 className="block text-sm font-medium text-gray-700 mb-2">Page Margins</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <label htmlFor="top-margin-input" className="block text-sm font-medium text-gray-700">Top</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input id="top-margin-range" type="range" min={minMargin} max={maxMargin} step={marginStep} value={units === 'mm' ? margin.top : margin.top / MM_PER_INCH} onChange={(e) => handleMarginChange('top', e.target.value, true)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="relative w-14 flex-shrink-0">
                            <input id="top-margin-input" type="number" min={minMargin} max={maxMargin} step={marginStep} value={localMarginsStr.top} onChange={(e) => handleMarginChange('top', e.target.value)} onBlur={() => handleMarginInputBlur('top')} className="w-full border-gray-300 rounded-md shadow-sm text-right pr-6" onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }} />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none text-gray-500 text-xs">{units}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="bottom-margin-input" className="block text-sm font-medium text-gray-700">Bottom</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input id="bottom-margin-range" type="range" min={minMargin} max={maxMargin} step={marginStep} value={units === 'mm' ? margin.bottom : margin.bottom / MM_PER_INCH} onChange={(e) => handleMarginChange('bottom', e.target.value, true)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="relative w-14 flex-shrink-0">
                            <input id="bottom-margin-input" type="number" min={minMargin} max={maxMargin} step={marginStep} value={localMarginsStr.bottom} onChange={(e) => handleMarginChange('bottom', e.target.value)} onBlur={() => handleMarginInputBlur('bottom')} className="w-full border-gray-300 rounded-md shadow-sm text-right pr-6" onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }} />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none text-gray-500 text-xs">{units}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="right-margin-input" className="block text-sm font-medium text-gray-700">Right</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input id="right-margin-range" type="range" min={minMargin} max={maxMargin} step={marginStep} value={units === 'mm' ? margin.right : margin.right / MM_PER_INCH} onChange={(e) => handleMarginChange('right', e.target.value, true)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="relative w-14 flex-shrink-0">
                            <input id="right-margin-input" type="number" min={minMargin} max={maxMargin} step={marginStep} value={localMarginsStr.right} onChange={(e) => handleMarginChange('right', e.target.value)} onBlur={() => handleMarginInputBlur('right')} className="w-full border-gray-300 rounded-md shadow-sm text-right pr-6" onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }} />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none text-gray-500 text-xs">{units}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="left-margin-input" className="block text-sm font-medium text-gray-700">Left</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input id="left-margin-range" type="range" min={minMargin} max={maxMargin} step={marginStep} value={units === 'mm' ? margin.left : margin.left / MM_PER_INCH} onChange={(e) => handleMarginChange('left', e.target.value, true)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="relative w-14 flex-shrink-0">
                            <input id="left-margin-input" type="number" min={minMargin} max={maxMargin} step={marginStep} value={localMarginsStr.left} onChange={(e) => handleMarginChange('left', e.target.value)} onBlur={() => handleMarginInputBlur('left')} className="w-full border-gray-300 rounded-md shadow-sm text-right pr-6" onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }} />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none text-gray-500 text-xs">{units}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-4">
             <div className="space-y-3">
                 <button
                    onClick={onPrint}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                >
                    Print Paper
                </button>
                <button
                    onClick={onDownloadPdf}
                    className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-transform transform hover:scale-105"
                >
                    Download as PDF
                </button>
                <div className="pt-2">
                    <label htmlFor="page-count" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of pages
                    </label>
                    <input
                        id="page-count"
                        type="number"
                        min="1"
                        max="250"
                        value={numberOfPages}
                        onChange={handlePageNumberChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        aria-describedby="page-count-description"
                    />
                    <p id="page-count-description" className="text-xs text-gray-500 mt-1">
                        Maximum 250 pages.
                    </p>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
                For best results when printing, disable headers and footers in your browser's print settings.
            </p>
        </div>
      </div>
    </aside>
  );
};

export default Controls;