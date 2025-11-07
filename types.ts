
export type PatternId = 'dots' | 'graph' | 'lines' | 'isometric' | 'hexagons' | 'music';

export interface PatternType {
  id: PatternId;
  name: string;
}

export interface PageSize {
  name: string;
  width: number; // in mm
  height: number; // in mm
}

export type Unit = 'mm' | 'in';

export type Margins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};