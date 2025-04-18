import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsParser from "@typescript-eslint/parser"; // Import TypeScript parser
import tsPlugin from "@typescript-eslint/eslint-plugin"; // Import TypeScript plugin

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"], // Add support for TypeScript files
    languageOptions: {
      parser: tsParser, // Use TypeScript parser
      ecmaVersion: "latest",
      ecmaFeatures: { jsx: true },
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin, // Add TypeScript plugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules, // Use recommended TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^[A-Z_]", argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off", // Optional: Disable explicit return type enforcement
      "@typescript-eslint/no-explicit-any": "warn", // Warn when using `any`
      "@typescript-eslint/no-empty-interface": "warn", // Warn about empty interfaces
      "@typescript-eslint/no-non-null-assertion": "warn", // Warn about non-null assertions
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
