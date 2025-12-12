import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/ja";
import "./app.css";

import { ColorSchemeScript, Container, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { SideMenu } from "./components/SideMenu";
import { mantineTheme } from "./config/mantine";

dayjs.extend(customParseFormat);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
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
  return (
    <div className="flex min-h-dvh flex-col bg-black">
      <div className="flex flex-1 bg-black">
        <SideMenu />
        <main className="flex-1 bg-black">
          <Outlet />
        </main>
      </div>

      <footer className="sticky top-full border border-gray-2 bg-black">
        <Container className="flex justify-center p-4 md:justify-end" size="lg">
          <p className="inline-flex flex-col items-center justify-center gap-2 text-sm font-semibold text-zinc-700 md:flex-row md:gap-4">
            <span>Copyright BordXplorer © 2025 All Rights Reserved.</span>
          </p>
        </Container>
      </footer>
    </div>
  );
}
