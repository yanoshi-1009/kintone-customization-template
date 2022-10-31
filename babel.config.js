const packageJson = require("./package.json");

module.exports = function (api) {
  api.cache(true);

  const presets = [["@babel/preset-env"]];
  const plugins = [
    [
      "@babel/plugin-transform-runtime",
      {
        version: packageJson.dependencies["@babel/runtime"].replace("^", "")
      }
    ],
    [
      "polyfill-corejs3",
      {
        method: "usage-pure",
        version: packageJson.dependencies["core-js-pure"]
          .replace(/^\^/g, "")
          .replace(/.[0-9]+$/g, "")
      }
    ]
  ];

  return {
    presets,
    plugins
  };
};
