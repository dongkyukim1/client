// eslint.config.mjs
import pluginNext from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

export default [
  // TypeScript 지원
  ...tseslint.configs.recommendedTypeChecked,
  
  // Next.js 규칙 적용
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
];
