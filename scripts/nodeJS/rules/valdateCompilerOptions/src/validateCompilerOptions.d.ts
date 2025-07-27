interface TsConfig {
    compilerOptions: {
        target?: string;
        module?: string;
        moduleResolution?: string;
    };
}
declare function validateCompilerOptions(config: TsConfig): {
    valid: boolean;
    errors: string[];
};
export { validateCompilerOptions, type TsConfig };
declare const _default: {
    validateCompilerOptions: typeof validateCompilerOptions;
    TsConfig: TsConfig;
};
export default _default;
