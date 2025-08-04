import { describe, it, expect } from 'vitest';
import { BarrelContentGenerator } from '../src/BarrelContentGenerator.js';

describe('BarrelContentGenerator', () => {
    it('generates star exports excluding tests', () => {
        const generator = new BarrelContentGenerator();
        const result = generator.generate([
            'A.ts',
            'B.ts',
            'index.ts',
            'ignore.test.ts'
        ]);
        expect(result).toContain(`export * from './A.js'`);
        expect(result).toContain(`export * from './B.js'`);
        expect(result).not.toContain('ignore.test');
        expect(result).not.toContain('index.ts');
    });

    it('generates named exports when exportStyle is named', () => {
        const generator = new BarrelContentGenerator({ exportStyle: 'named' });
        const result = generator.generate(['my-component.ts']);
        expect(result).toContain(`export { default as MyComponent } from './my-component.js'`);
    });
});
