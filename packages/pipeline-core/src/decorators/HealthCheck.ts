import 'reflect-metadata';
const HEALTH_KEY = Symbol('health');
export function HealthCheck(healthCheckType: new () => any) { return Reflect.metadata(HEALTH_KEY, healthCheckType); }
export function getHealthCheck(target: any): new () => any | undefined { return Reflect.getMetadata(HEALTH_KEY, target.constructor); }