import { chai } from 'vitest';
declare global {
    namespace Chai {
        interface Assertion {
        }
    }
}
export { chai };
