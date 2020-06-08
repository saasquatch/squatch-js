// cucumber.js
// const dotenv = require('dotenv');
const os = require("os");
// dotenv.config();

/**
 *
 * Configures Cucumber
 *
 * Sets up the required stuff to make React code operate nicely in a Node environment
 *
 * Source: https://medium.com/@Charles_Stover/behavior-driven-react-development-with-cucumber-faf596d9d71b
 *
 */
const CPU_COUNT = os.cpus().length;
const IS_DEV = process.env.NODE_ENV === "development";
const FAIL_FAST = IS_DEV ? ["--fail-fast"] : [];
const FORMAT =
  process.env.CI || !process.stdout.isTTY ? "progress" : "progress-bar";

exports.default = [
  ...FAIL_FAST,
  `--format ${FORMAT}`,
  `--parallel ${CPU_COUNT}`,

  "test/**/*.feature",
  //   "../../../blackbox-testing/features/**/*.feature",

  `--tags "@testsuite:squatch-js and not @skip"`,

  // Babel and jsDom make our code work as if it's in the browser
  //   "--require-module jsdom-global/register",
  //   "--require-module ts-node/register",
  "--require-module " + __dirname + "/babelregister.js",
  // '--require-module source-map-support/register',

  // Order matters -- these setups need to happen first
  //   "--require tests/cucumber-setup/loaders.ts",

  // Step definitions go last
  "--require test/step_definitions/**/*.ts",
  "--require test/step_definitions/**/*.tsx",

  // '--format usage',
].join(" ");
