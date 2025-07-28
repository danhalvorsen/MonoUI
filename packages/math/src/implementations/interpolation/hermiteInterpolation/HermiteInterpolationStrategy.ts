import { IInterpolationStrategy } from "../../../interfaces/IInterpolationStrategy";
import { HermiteSegment } from "./HermiteSegment";

export class HermiteInterpolationStrategy<T> implements IInterpolationStrategy<T, number> {
  constructor(private readonly interpolateFn: (segment: HermiteSegment<T>, t: number) => T) {}

  interpolate(segment: HermiteSegment<T>, t: number): T {
    return this.interpolateFn(segment, t);
  }
}

