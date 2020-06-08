// Cucumber babel config file
// overrides node's require and runs through babel/typescript
// based on https://github.com/microsoft/TypeScript-Babel-Starter/blob/master/.babelrc
require("@babel/register")({
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 2,
      },
    ],
    "@babel/plugin-proposal-class-properties",
  ],
});
