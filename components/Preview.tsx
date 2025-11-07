
import React from 'react';
import { PatternType, PageSize, Unit, PatternId, Margins } from '../types';
import DotsPattern from './patterns/DotsPattern';
import GraphPattern from './patterns/GraphPattern';
import LinesPattern from './patterns/LinesPattern';
import IsometricDotsPattern from './patterns/IsometricDotsPattern';
import HexagonPattern from './patterns/HexagonPattern';
import MusicStaffPattern from './patterns/MusicStaffPattern';

interface PreviewProps {
  pattern: PatternType;
  pageSize: PageSize;
  orientation: 'portrait' | 'landscape';
  spacing: number; // in mm
  units: Unit;
  color: string;
  lineThickness: number;
  margin: Margins; // in mm
}

const patternComponents: Record<PatternId, React.FC<any>> = {
    dots: DotsPattern,
    graph: GraphPattern,
    lines: LinesPattern,
    isometric: IsometricDotsPattern,
    hexagons: HexagonPattern,
    music: MusicStaffPattern,
};

const Preview: React.FC<PreviewProps> = ({
  pattern,
  pageSize,
  orientation,
  spacing,
  color,
  lineThickness,
  margin,
}) => {
  const width = orientation === 'portrait' ? pageSize.width : pageSize.height;
  const height = orientation === 'portrait' ? pageSize.height : pageSize.width;

  // Calculate drawable area, ensuring margins don't exceed page dimensions
  const drawableWidth = Math.max(0, width - (margin.left + margin.right));
  const drawableHeight = Math.max(0, height - (margin.top + margin.bottom));

  const PatternComponent = patternComponents[pattern.id];
  
  return (
    <div
      className="bg-white shadow-2xl overflow-hidden print:shadow-none"
      style={{
        width: `${width}mm`,
        height: `${height}mm`,
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <PatternComponent 
            width={drawableWidth} 
            height={drawableHeight} 
            spacing={spacing} 
            color={color}
            lineThickness={lineThickness}
          />
        </g>
      </svg>
    </div>
  );
};

export default Preview;