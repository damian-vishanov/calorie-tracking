module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    "no-unused-vars": ["error"],
    "eol-last": ["error", "always"],
    "no-multi-spaces": "error",
    "import/no-duplicates": ["error"],
    "array-bracket-spacing": ["error", "never"],
    "comma-spacing": ["error", { before: false, after: true }],
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
    "space-in-parens": ["error", "never"],
    "no-trailing-spaces": "error"
  }
};
