// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./eslint-typegen.d.ts" />

import js from "@eslint/js";
import type { Linter } from "eslint";
import gitignore from "eslint-config-flat-gitignore";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import * as reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import typegen from "eslint-typegen";
import globals from "globals";
import type { InfiniteDepthConfigWithExtends } from "typescript-eslint";
import tseslint from "typescript-eslint";

const tsFiles = "**/*.{ts,tsx,mts,cts}";
const jsFiles = "**/*.{js,jsx,mjs,cjs}";
const jsxFiles = "**/*.{jsx,tsx}";

const config = [
  gitignore(),
  {
    files: [jsFiles],
    ...js.configs.recommended,
  },
  {
    ignores: ["app/generated/**"],
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
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-confusing-non-null-assertion": "off",
      "@typescript-eslint/no-deprecated": "warn",
      "@typescript-eslint/no-duplicate-enum-values": "off",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/prefer-function-type": "off",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              allowTypeImports: true,
              name: "@mantine/core",
              importNames: ["TextInput"],
              message:
                "Please use TextInput from '~/components/mantine/TextInput' instead.",
            },
            {
              allowTypeImports: true,
              name: "@mantine/core",
              importNames: ["Fieldset"],
              message:
                "Please use Fieldset from '~/components/mantine/Fieldset' instead.",
            },
          ],
        },
      ],
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
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
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
      "react/jsx-sort-props": "error",
      "react-refresh/only-export-components": [
        "error",
        {
          allowExportNames: ["meta", "links", "headers", "loader", "action"],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              allowTypeImports: true,
              name: "@testing-library/react",
              message:
                "Please import from '~/test/test-react' instead of '@testing-library/react'.",
            },
            {
              allowTypeImports: true,
              name: "@testing-library/user-event",
              importNames: ["default"],
              message:
                "Please import 'userEvent' from '~/test/test-react' instead of '@testing-library/user-event'.",
            },
          ],
        },
      ],
    },
  },
] satisfies Array<
  Linter.Config & {
    extends?: InfiniteDepthConfigWithExtends;
  }
>;

// @ts-expect-error TypeScript は ./eslint-typegen を見てしまう
// 実際のnode_modules 内の型定義には反していない
export default typegen(
  tseslint.config(
    // @ts-expect-error 型が合わないが、実際には動作する
    config,
  ),
);
