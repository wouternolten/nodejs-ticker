module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:cypress/recommended"
  ],
  rules: {
    "no-console": "off",
    "@typescript-eslint/interface-name-prefix": "off",
  },
  overrides: [
    {
      files: [
        "**/*.spec.ts",
        "./database/integration-tests/*.ts",
        "./database/integration-tests/**/*.ts"
      ],
      plugins: ["jest"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
    {
      files: [
        "**/*.spec.js"
      ],
      plugins: ["cypress"],
      rules: {
        "@typescript-eslint/no-use-before-define": "off"
      }
    }
  ],
};
