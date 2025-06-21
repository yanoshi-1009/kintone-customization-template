import cybozuEslintConfig from "@cybozu/eslint-config/presets/typescript-prettier.js";

export default [
  ...cybozuEslintConfig,
  {
    languageOptions: {
      globals: {
        kintone: "readonly"
      }
    }
  }
];
