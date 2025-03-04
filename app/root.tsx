import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/ja";
import "./app.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { Favicons } from "./components/Favicon";
import { mantineTheme } from "./config/mantine";

dayjs.extend(customParseFormat);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Favicons />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body className="min-h-dvh">
        <MantineProvider theme={mantineTheme}>
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
