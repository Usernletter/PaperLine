
import React from 'react';

interface PatternProps {
  width: number;
  height: number;
  spacing: number;
  color: string;
  lineThickness: number;
}

const LinesPattern: React.FC<PatternProps> = ({ width, height, spacing, color, lineThickness }) => {
  const strokeWidth = spacing * lineThickness;
  const lines = [];

  for (let i = 1; i * spacing < height; i++) {
    const id = `l-${i}`;
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

export default LinesPattern;
