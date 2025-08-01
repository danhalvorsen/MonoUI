// Neutral Cartesian space
export interface IPoint { 
  x: number; 
  y: number; 
}

export interface ICoordinateSystem<TPoint = IPoint> {
  toCanonical(point: TPoint): IPoint;
  fromCanonical(point: IPoint): TPoint;
}
