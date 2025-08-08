/**
 * @type {import("prettier").Config}
 */
export default {
  arrowParens: "always",
  endOfLine: "lf",
  jsxSingleQuote: false,
  quoteProps: "consistent",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  plugins: ["@prettier/plugin-oxc", "prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/app.css",
  overrides: [
    {
      files: ["**/*.yml", "**/*.yaml"],
      options: {
        singleQuote: true,
      },
    },
  ],
};
