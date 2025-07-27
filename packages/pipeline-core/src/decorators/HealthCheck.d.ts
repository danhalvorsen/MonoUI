import 'reflect-metadata';
export declare function HealthCheck(healthCheckType: new () => any): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function getHealthCheck(target: any): new () => any | undefined;
