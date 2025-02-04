import { createTheme } from "@mantine/core";

export const mantineTheme = createTheme({
  black: "#222",
  breakpoints: {
    // tailwindcss の値に合わせる
    xs: "40rem",
    sm: "48rem",
    md: "64rem",
    lg: "80rem",
    xl: "96rem",
  },
});

export const mantineInputOrder = [
  "label",
  "input",
  "description",
  "error",
] as const satisfies Array<"label" | "input" | "description" | "error">;
