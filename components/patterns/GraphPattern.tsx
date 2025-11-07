
import React from 'react';

interface PatternProps {
  width: number;
  height: number;
  spacing: number;
  color: string;
  lineThickness: number;
}

const GraphPattern: React.FC<PatternProps> = ({ width, height, spacing, color, lineThickness }) => {
  const strokeWidth = spacing * lineThickness;
  const lines = [];

  // Vertical lines
  for (let i = 1; i * spacing < width; i++) {
    const id = `v-${i}`;
    lines.push(
      <line
        key={id}
        x1={i * spacing}
        y1="0"
        x2={i * spacing}
        y2={height}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    );
  }

  // Horizontal lines
  for (let i = 1; i * spacing < height; i++) {
    const id = `h-${i}`;
    lines.push(
      <line
        key={id}
        x1="0"
        y1={i * spacing}
        x2={width}
        y2={i * spacing}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    );
  }

  return <>{lines}</>;
};

export default GraphPattern;
