import 'reflect-metadata';
const ROUTE_KEY = Symbol('route');
export type RouteCondition<TData> = (data: TData) => boolean;
export function Route<TData>(condition: RouteCondition<TData>) { return Reflect.metadata(ROUTE_KEY, condition); }
export function getRouteCondition<TData>(target: any): RouteCondition<TData> | undefined { return Reflect.getMetadata(ROUTE_KEY, target.constructor); }