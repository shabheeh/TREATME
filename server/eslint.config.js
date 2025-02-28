import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Define files to lint
  { files: ["**/*.{js,mjs,cjs,ts}"] },

  // Enable Node.js global variables
  { languageOptions: { globals: globals.node } },

  // Include recommended JavaScript rules
  pluginJs.configs.recommended,

  // Include recommended TypeScript rules
  ...tseslint.configs.recommended,

  // Add Prettier configuration
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Enable Prettier as an ESLint rule
      "prettier/prettier": "error",
    },
  },

  // Disable ESLint rules that conflict with Prettier
  prettierConfig,
];
