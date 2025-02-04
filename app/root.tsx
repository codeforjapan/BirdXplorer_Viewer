import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/ja";
import "./app.css";

import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const theme = createTheme({
  black: "#222",
  breakpoints: {
    xs: "40rem",
    sm: "48rem",
    md: "64rem",
    lg: "80rem",
    xl: "96rem",
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <DatesProvider settings={{ locale: "ja", consistentWeeks: true }}>
            {children}
          </DatesProvider>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
