import cybozuEslintConfig from "@cybozu/eslint-config/flat/presets/node-typescript-prettier.js";

export default [...cybozuEslintConfig, { ignores: ["node_modules", "dist"] }];
