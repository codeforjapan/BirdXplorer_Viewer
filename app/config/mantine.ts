import { createTheme, Input } from "@mantine/core";

export const mantineTheme = createTheme({
  black: "#222",
  components: {
    // FormError が <ul> を描画するため、デフォルトの <p> だと不正な HTML ネストになる
    InputError: Input.Error.extend({
      defaultProps: { component: "div" },
    }),
  },
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
