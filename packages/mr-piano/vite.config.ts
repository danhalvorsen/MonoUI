
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build:{
    lib:{
      entry: resolve(__dirname,'src/index.ts'),
      name:'MrPiano',
      fileName:(fmt)=>`mr-piano.${fmt}.js`,
      formats:['es','umd']
    },
    sourcemap:true,
    emptyOutDir:true
  },
  test:{
    globals:true,
    environment:'node',
    include:['tests/**/*.test.ts']
  }
});
