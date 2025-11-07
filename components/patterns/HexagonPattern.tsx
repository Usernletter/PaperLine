
import React from 'react';

interface PatternProps {
  width: number;
  height: number;
  spacing: number;
  color: string;
  lineThickness: number;
}

const HexagonPattern: React.FC<PatternProps> = ({ width, height, spacing, color, lineThickness }) => {
  const strokeWidth = spacing * lineThickness;
  const hexRadius = spacing / Math.sqrt(3); // side length = hexRadius
  const hexWidth = Math.sqrt(3) * hexRadius;
  const hexHeight = 2 * hexRadius;

  const segments = [];
  const drawnSegments = new Set<string>(); // To avoid drawing the same line twice

  for (let y = 0; y * (hexHeight * 3/4) < height + hexHeight; y++) {
    for (let x = -1; x * hexWidth < width + hexWidth; x++) {
      const cx = x * hexWidth + (y % 2 === 1 ? hexWidth / 2 : 0);
      const cy = y * (hexHeight * 3/4);

      // Points of a hexagon around (cx, cy)
      const points = Array.from({ length: 6 }).map((_, i) => {
        const angle_deg = 60 * i + 30; // Pointy top hexagons
        const angle_rad = Math.PI / 180 * angle_deg;
        return [cx + hexRadius * Math.cos(angle_rad), cy + hexRadius * Math.sin(angle_rad)];
      });

      // Draw 6 segments
      for (let i = 0; i < 6; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % 6];
        
        // Create a unique, order-independent ID for the segment
        const p1_str = `${p1[0].toFixed(2)},${p1[1].toFixed(2)}`;
        const p2_str = `${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
        const segId = [p1_str, p2_str].sort().join(':');
        
        if (drawnSegments.has(segId)) continue;
        drawnSegments.add(segId);

        segments.push(
          <line
            key={segId}
            x1={p1[0]} y1={p1[1]}
            x2={p2[0]} y2={p2[1]}
            stroke={color}
            strokeWidth={strokeWidth}
          />
        );
      }
    }
  }

  return <g>{segments}</g>;
};


export default HexagonPattern;
