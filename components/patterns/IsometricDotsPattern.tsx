
import React from 'react';

interface PatternProps {
  width: number;
  height: number;
  spacing: number;
  color: string;
}

const IsometricDotsPattern: React.FC<PatternProps> = ({ width, height, spacing, color }) => {
  const dotRadius = spacing * 0.05;
  const vertSpacing = spacing * Math.sqrt(3) / 2;
  const dots = [];

  for (let y = 1; y * vertSpacing < height; y++) {
    for (let x = 0; (x * spacing) - (spacing/2) < width; x++) {
      const isStaggeredRow = y % 2 !== 0;
      const currentX = x * spacing + (isStaggeredRow ? 0 : spacing / 2);
      const currentY = y * vertSpacing;

      if (currentX > width) continue;

      const id = `iso-${x}-${y}`;
      dots.push(
        <circle
          key={id}
          cx={currentX}
          cy={currentY}
          r={dotRadius}
          fill={color}
        />
      );
    }
  }
  
  return <>{dots}</>;
};

export default IsometricDotsPattern;
