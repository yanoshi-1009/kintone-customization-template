module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3.24"
      }
    ]
  ];
  const plugins = [];

  return {
    presets,
    plugins
  };
};
