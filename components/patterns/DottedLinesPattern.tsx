import React from 'react';

interface PatternProps {
  width: number;
  height: number;
  spacing: number;
  color: string;
  lineThickness: number;
  dotSpacing: number;
}

const DottedLinesPattern: React.FC<PatternProps> = ({ width, height, spacing, color, lineThickness, dotSpacing }) => {
  const dotRadius = (spacing * lineThickness) / 2;
  const dots = [];

  // Horizontal lines of dots
  for (let y = 1; y * spacing < height; y++) {
    const lineY = y * spacing;

    // Dots along the line
    for (let x = 0; x * dotSpacing < width; x++) {
      const dotX = x * dotSpacing;
      if (dotX > 0) { // To avoid dot at the very edge
          const id = `dl-${y}-${x}`;
          dots.push(
            <circle
              key={id}
              cx={dotX}
              cy={lineY}
              r={dotRadius}
              fill={color}
            />
          );
      }
    }
  }

  return <>{dots}</>;
};

export default DottedLinesPattern;
