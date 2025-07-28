import { HermiteSegment } from "../implementations/interpolation/hermiteInterpolation/HermiteSegment";
import { ParameterT } from "../implementations/Transform";

export interface IInterpolationStrategy<T, ParameterT> {
    interpolate(segment: HermiteSegment<T>, t: ParameterT): T;
}
