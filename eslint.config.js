import cybozuEslintConfig from "@cybozu/eslint-config/presets/node-typescript-prettier";

export default [
  ...cybozuEslintConfig,
  { ignores: ["node_modules", "dist", "eslint.config.js"] },
  { rules: { "n/no-unpublished-import": "off" } }
];
