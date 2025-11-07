import { PageSize, PatternType } from './types';

export const PAGE_SIZES: PageSize[] = [
  { name: 'A4', width: 210, height: 297 },
  { name: 'Letter', width: 215.9, height: 279.4 },
  { name: 'A3', width: 297, height: 420 },
  { name: 'A5', width: 148, height: 210 },
  { name: 'Legal', width: 215.9, height: 355.6 },
  { name: 'Tabloid', width: 279.4, height: 431.8 },
  { name: 'Custom', width: 210, height: 297 }, // Default to A4
];

export const PATTERN_TYPES: PatternType[] = [
  { id: 'graph', name: 'Graph' },
  { id: 'dots', name: 'Dots' },
  { id: 'lines', name: 'Lines' },
  { id: 'isometric', name: 'Isometric Dots' },
  { id: 'hexagons', name: 'Hexagons' },
  { id: 'music', name: 'Music Staff' },
];

export const MM_PER_INCH = 25.4;