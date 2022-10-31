module.exports = function (api) {
  api.cache(true);

  const presets = [["@babel/preset-env"]];
  const plugins = [
    ["@babel/plugin-transform-runtime", { version: "7.20.0" }],
    [
      "polyfill-corejs3",
      {
        method: "usage-pure",
        version: "3.26"
      }
    ]
  ];

  return {
    presets,
    plugins
  };
};
