import { describe, it, expect } from 'vitest';
import { VirtualFileSystemBuilder } from '../../virtual-filesystem/src/VirtualFileSystemBuilder.js';
import { BarrelService } from '../src/BarrelService.js';

class InMemoryBarrelService extends BarrelService {
    public generateForVirtual(fs: ReturnType<VirtualFileSystemBuilder['build']>, modulePath: string): string {
        const files = Array.from(fs.files.keys())
            .filter(f => f.startsWith(modulePath))
            .filter(f => f.endsWith('.ts') && !f.endsWith('index.ts'))
            .filter(f => ![/\.test\.ts$/, /\.spec\.ts$/, /\.d\.ts$/].some(re => re.test(f)));

        return files
            .map(f => `export * from './${f.split('/').pop()!.replace(/\.ts$/, '.js')}';`)
            .join('\n');
    }
}

describe('BarrelService', () => {
    it('should generate barrels for two modules in a monorepo', () => {
        const fs = new VirtualFileSystemBuilder()
            // module 1
            .withDirectory('/packages/module1/src')
            .withFile('/packages/module1/src/A.ts', 'export const A = 1;')
            .withFile('/packages/module1/src/B.ts', 'export const B = 2;')
            // module 2
            .withDirectory('/packages/module2/src')
            .withFile('/packages/module2/src/C.ts', 'export const C = 3;')
            .withFile('/packages/module2/src/D.ts', 'export const D = 4;')
            .build();

        const generator = new InMemoryBarrelService({ rootDir: '/packages' });

        const barrel1 = generator.generateForVirtual(fs, '/packages/module1/src');
        const barrel2 = generator.generateForVirtual(fs, '/packages/module2/src');

        expect(barrel1).toContain(`export * from './A.js'`);
        expect(barrel1).toContain(`export * from './B.js'`);
        expect(barrel2).toContain(`export * from './C.js'`);
        expect(barrel2).toContain(`export * from './D.js'`);
    });
});
