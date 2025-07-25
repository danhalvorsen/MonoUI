interface TokenServiceOptions {
    name: string;
    tokensPath: string;
    outputDir: string;
}
export declare function generateTokenService({ name, tokensPath, outputDir, }: Omit<TokenServiceOptions, 'interfacePath'>): void;
declare function main(): Promise<void>;
export { main };
