import { IBarrelContentOptions } from "./IBarrelContentOptions.js";


export class BarrelContentGenerator {
    private readonly barrelName: string;
    private readonly exclude: RegExp[];
    private readonly exportStyle: 'star' | 'named';

    constructor(options?: IBarrelContentOptions) {
        this.barrelName = options?.barrelName ?? 'index.ts';
        this.exclude = options?.exclude ?? [/\.test\.ts$/, /\.spec\.ts$/, /\.d\.ts$/];
        this.exportStyle = options?.exportStyle ?? 'star';
    }

    public generate(files: string[]): string {
        const filtered = files
            .filter(f => f.endsWith('.ts'))
            .filter(f => !f.endsWith(this.barrelName))
            .filter(f => !this.exclude.some(re => re.test(f)));

        return filtered
            .map(f => {
                const fileName = f.split('/').pop()!.replace(/\.ts$/, '.js');
                return this.exportStyle === 'star'
                    ? `export * from './${fileName}';`
                    : `export { default as ${this.toPascal(fileName)} } from './${fileName}';`;
            })
            .join('\n');
    }

    private toPascal(name: string): string {
        return name
            .replace(/\.js$/, '')
            .replace(/(^\w|-\w)/g, m => m.replace('-', '').toUpperCase());
    }
}
