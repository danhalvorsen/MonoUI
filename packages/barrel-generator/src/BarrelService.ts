import { Project, QuoteKind } from 'ts-morph';
import fs from 'fs';
import path from 'path';
import { BarrelContentGenerator, BarrelContentOptions } from './BarrelContentGenerator.js';

export interface BarrelServiceOptions extends BarrelContentOptions {
    rootDir: string;
    dryRun?: boolean;
}

export class BarrelService {
    private readonly generator: BarrelContentGenerator;
    private readonly project: Project;
    private readonly options: Required<Pick<BarrelServiceOptions, 'barrelName' | 'dryRun'>> & { rootDir: string };

    constructor(opts: BarrelServiceOptions) {
        this.project = new Project({ manipulationSettings: { quoteKind: QuoteKind.Single } });
        this.generator = new BarrelContentGenerator(opts);
        this.options = {
            rootDir: opts.rootDir,
            barrelName: opts.barrelName ?? 'index.ts',
            dryRun: opts.dryRun ?? false
        };
    }

    public run(): void {
        this.processDirectory(this.options.rootDir);
        if (!this.options.dryRun) {
            this.project.saveSync();
        }
    }

    private processDirectory(dir: string): void {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        const tsFiles = entries
            .filter(f => f.isFile())
            .map(f => f.name);

        for (const entry of entries.filter(e => e.isDirectory())) {
            this.processDirectory(path.join(dir, entry.name));
        }

        const content = this.generator.generate(tsFiles);
        if (!content) return;

        const barrelPath = path.join(dir, this.options.barrelName);

        if (this.options.dryRun) {
            console.log(`(dry-run) Would generate: ${barrelPath}`);
            console.log(content);
            console.log('---');
            return;
        }

        if (fs.existsSync(barrelPath)) fs.unlinkSync(barrelPath);
        this.project.createSourceFile(barrelPath, content, { overwrite: true });
        console.log(`Generated: ${barrelPath}`);
    }
}
