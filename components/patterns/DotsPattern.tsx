
import React from 'react';

interface PatternProps {
  width: number;
  height: number;
  spacing: number;
  color: string;
}

const DotsPattern: React.FC<PatternProps> = ({ width, height, spacing, color }) => {
  const dotRadius = spacing * 0.05;
  const dots = [];

  for (let y = 1; y * spacing < height; y++) {
    for (let x = 1; x * spacing < width; x++) {
      const id = `d-${x}-${y}`;
      dots.push(
        <circle
          key={id}
          cx={x * spacing}
          cy={y * spacing}
          r={dotRadius}
          fill={color}
        />
      );
    }
  }

  return <>{dots}</>;
};

export default DotsPattern;
