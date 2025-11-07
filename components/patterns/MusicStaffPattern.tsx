
import React from 'react';

interface PatternProps {
  width: number;
  height: number;
  spacing: number; // spacing between staves
  color: string;
  lineThickness: number;
}

const MusicStaffPattern: React.FC<PatternProps> = ({ width, height, spacing, color, lineThickness }) => {
  const lineSpacing = spacing / 4; // Spacing between individual lines in a staff
  const staffHeight = lineSpacing * 4;
  const totalStaffGroupHeight = staffHeight + spacing * 2; // Staff + margin
  const strokeWidth = spacing * lineThickness;

  const staves = [];
  
  for (let i = 0; i * totalStaffGroupHeight < height; i++) {
      const staffY = i * totalStaffGroupHeight + spacing; // top margin
      
      if (staffY > height) break;

      for (let j = 0; j < 5; j++) {
          const lineY = staffY + (j * lineSpacing);
          if (lineY > height) break;
          const id = `s-${i}-l-${j}`;

          staves.push(
              <line
                  key={id}
                  x1="0"
                  y1={lineY}
                  x2={width}
                  y2={lineY}
                  stroke={color}
                  strokeWidth={strokeWidth}
              />
          )
      }
  }

  return <>{staves}</>;
};

export default MusicStaffPattern;
