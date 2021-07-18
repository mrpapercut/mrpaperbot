const path = require('path');

module.exports = {
    extends: "eslint:recommended",
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        babelOptions: {
            configFile: path.join(__dirname, '.babelrc')
        }
    },
    parser: '@babel/eslint-parser',
    rules: {

    }
};
