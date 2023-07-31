module.exports ={
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint",
    "import"
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env : {
    amd: true,
    node: true,
    es2020: true,
    browser: true,
    jquery: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "import/no-dynamic-require": 2,
    "no-console": 0,
    "quotes": ["error", "single"],
    "comma-dangle": [
      "error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "ignore"
      }
    ]
  }
}
