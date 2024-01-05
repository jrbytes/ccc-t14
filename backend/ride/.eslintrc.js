module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["standard-with-typescript", "prettier"],
  "plugins": ["prettier", "eslint-plugin-import-helpers"],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "no-new": "off",
    "import-helpers/order-imports": [
      "warn",
      {
        "newlinesBetween": "always",
        "groups": ["module", "/^@/", ["parent", "sibling", "index"]],
        "alphabetize": { "order": "asc", "ignoreCase": true }
      }
    ]
  }
}
