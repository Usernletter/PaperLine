import React, { useState } from 'react';
import Controls from './components/Controls';
import Preview from './components/Preview';
import { PatternType, PageSize, Unit, Margins } from './types';
import { PAGE_SIZES, PATTERN_TYPES } from './constants';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [pattern, setPattern] = useState<PatternType>(PATTERN_TYPES[0]);
  const [pageSize, setPageSize] = useState<PageSize>(PAGE_SIZES[0]);
  const [customSize, setCustomSize] = useState({ width: PAGE_SIZES[0].width, height: PAGE_SIZES[0].height });
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [spacing, setSpacing] = useState<number>(5);
  const [units, setUnits] = useState<Unit>('mm');
  const [color, setColor] = useState<string>('#d1d5db'); // light gray
  const [opacity, setOpacity] = useState<number>(1.0);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [lineThickness, setLineThickness] = useState<number>(0.025);
  const [margin, setMargin] = useState<Margins>({ top: 15, right: 15, bottom: 15, left: 15 }); // Default margin: 15mm

  const effectivePageSize = pageSize.name === 'Custom' 
    ? { ...pageSize, width: customSize.width, height: customSize.height } 
    : pageSize;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const { jsPDF } = window.jspdf;
    const input = document.getElementById('print-area');
    if (!input) {
        console.error("Could not find element to capture for PDF");
        return;
    }

    // The child element has the exact dimensions we need
    const paperElement = input.firstChild as HTMLElement;
    if (!paperElement) {
        console.error("Could not find paper element inside print area");
        return;
    }

    setTimeout(() => {
        window.html2canvas(paperElement, {
            scale: 4, // Higher scale for better PDF quality
            useCORS: true,
            logging: false,
            backgroundColor: null, // Use transparent background
        }).then((canvas: any) => {
          const imgData = canvas.toDataURL('image/png');
          
          const width = orientation === 'portrait' ? effectivePageSize.width : effectivePageSize.height;
          const height = orientation === 'portrait' ? effectivePageSize.height : effectivePageSize.width;
    
          const pdf = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: [width, height],
          });
          
          // Add the first page
          pdf.addImage(imgData, 'PNG', 0, 0, width, height);

          // Add subsequent pages if needed
          for (let i = 1; i < numberOfPages; i++) {
              pdf.addPage([width, height], orientation);
              pdf.addImage(imgData, 'PNG', 0, 0, width, height);
          }
    
          pdf.save('paper-line.pdf');
        });
    }, 100); // Small delay to allow DOM to update
  };

  const hexToRgba = (hex: string, alpha: number): string => {
    const hexValue = hex.slice(1);
    if (hexValue.length !== 6) {
        // Fallback for invalid hex
        return `rgba(209, 213, 219, ${alpha})`;
    }
    const r = parseInt(hexValue.slice(0, 2), 16);
    const g = parseInt(hexValue.slice(2, 4), 16);
    const b = parseInt(hexValue.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const finalColor = hexToRgba(color, opacity);

  return (
    <div className="main-layout flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      <div className="order-first md:order-none">
        <Controls
          pattern={pattern}
          setPattern={setPattern}
          pageSize={pageSize}
          setPageSize={setPageSize}
          customSize={customSize}
          setCustomSize={setCustomSize}
          orientation={orientation}
          setOrientation={setOrientation}
          spacing={spacing}
          setSpacing={setSpacing}
          units={units}
          setUnits={setUnits}
          color={color}
          setColor={setColor}
          opacity={opacity}
          setOpacity={setOpacity}
          lineThickness={lineThickness}
          setLineThickness={setLineThickness}
          onPrint={handlePrint}
          onDownloadPdf={handleDownloadPdf}
          numberOfPages={numberOfPages}
          setNumberOfPages={setNumberOfPages}
          margin={margin}
          setMargin={setMargin}
        />
      </div>
      <main className="flex-1 p-8 flex items-center justify-center bg-gray-200 print:bg-white print:p-0">
        <div id="print-area" className="w-full h-full flex items-center justify-center">
          <Preview
            pattern={pattern}
            pageSize={effectivePageSize}
            orientation={orientation}
            spacing={spacing}
            units={units}
            color={finalColor}
            lineThickness={lineThickness}
            margin={margin}
          />
        </div>
      </main>
      <aside 
        className="hidden md:block md:w-80 lg:w-96 bg-white shadow-lg print:hidden"
        aria-label="Advertisement space"
      >
        {/* This space is reserved for future ad placements. */}
      </aside>
    </div>
  );
};

export default App;