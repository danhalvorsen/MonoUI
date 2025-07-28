import { Vector3 } from '../implementations/Vector3';
import { IControlPointStrategy } from '../interfaces/IControlPointStrategy';

export class FiniteDifferenceTangentStrategy implements IControlPointStrategy<Vector3> {
estimate(points: Vector3[], index: number): Vector3 {
    const prev = points[index - 1] ?? points[index];
    const next = points[index + 1] ?? points[index];
    return next.subtract(prev).scale(0.5); // Updated to use 'scale' for scalar multiplication
}
}