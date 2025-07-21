import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    
    include: [],

    // type-check config nested inside `test`
    typecheck: {
      include: ['test/integrations/**/*.test-d.ts'],
      tsconfig: './test/tsconfig.test.json',
    },
  },
});











// import { defineConfig } from 'vitest/config';

// export default defineConfig({
//   test: {
//     // disable running any "unit" tests by default
//     include: [],

//     // only type-check our integration TS files
//     typecheck: {
//       include: ['test/integrations/**/*.{test,spec}.{ts,tsx}'],
//     },
//   },
// });
