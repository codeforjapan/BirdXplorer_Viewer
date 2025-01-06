// @ts-check

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import jsx from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

const tsFiles = "**/*.{ts,tsx,mts,cts}";
const jsFiles = "**/*.{js,jsx,mjs,cjs}";
const jsxFiles = "**/*.{jsx,tsx}";

const compat = new FlatCompat();

export default tseslint.config(
  gitignore(),
  {
    files: [jsFiles],
    ...js.configs.recommended,
  },
  {
    files: [tsFiles],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/adjacent-overload-signatures": "off",
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "array-simple",
        },
      ],
      "@typescript-eslint/class-literal-property-style": "off",
      "@typescript-eslint/consistent-generic-constructors": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-confusing-non-null-assertion": "off",
      "@typescript-eslint/no-deprecated": "warn",
      "@typescript-eslint/no-duplicate-enum-values": "off",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/prefer-function-type": "off",
      "@typescript-eslint/promise-function-async": "error",
    },
  },
  {
    files: [jsFiles, tsFiles],
    languageOptions: {
      sourceType: "module",
    },
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
    },
  },
  {
    files: [jsxFiles],
    extends: [
      // @ts-expect-error 型が合わない
      react.configs.flat.recommended,
      // @ts-expect-error 型が合わない
      react.configs.flat["jsx-runtime"],
      ...compat.extends("plugin:react-hooks/recommended"),
      reactRefresh.configs.vite,
      jsx.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // this is for form callback
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "react/button-has-type": "error",
      "react/iframe-missing-sandbox": "error",
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/jsx-no-target-blank": ["error", { allowReferrer: true }],
      "react/prop-types": "off",
      "react/self-closing-comp": "error",
      "react-refresh/only-export-components": [
        "error",
        { allowExportNames: ["meta", "links", "headers", "loader", "action"] },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
