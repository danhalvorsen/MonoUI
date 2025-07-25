export declare class PackageReferenceValidator {
    private readonly packagesDir;
    private readonly packageDependencies;
    constructor(packagesDir: string);
    private loadPackageDependencies;
    private getPackageNames;
    validateReferences(): void;
    private checkImportsInFile;
    private shouldSkipImport;
    private validatePackageImport;
}
