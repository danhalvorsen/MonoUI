export interface IHealthCheck { check(): Promise<boolean>; reason?: string; }
