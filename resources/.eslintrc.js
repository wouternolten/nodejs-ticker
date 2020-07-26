module.exports = {
    root: true,
    env: {
        node: true,
        jest: true
    },
    extends: [
        "plugin:cypress/recommended",
        "plugin:vue/essential",
        "eslint:recommended"
    ],
    parserOptions: {
        parser: "babel-eslint"
    },
    rules: {}
};
