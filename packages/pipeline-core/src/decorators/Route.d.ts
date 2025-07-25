import 'reflect-metadata';
export type RouteCondition<TData> = (data: TData) => boolean;
export declare function Route<TData>(condition: RouteCondition<TData>): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function getRouteCondition<TData>(target: any): RouteCondition<TData> | undefined;
