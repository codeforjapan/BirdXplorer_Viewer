import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/ja";
import "./app.css";

import {
  ColorSchemeScript,
  Container,
  MantineProvider,
  Progress,
} from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteError,
} from "react-router";

import { LogoIcon } from "./components/logo";
import { MobileMenuButton, SideMenu } from "./components/SideMenu";
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
      <body className="overflow-x-hidden bg-black">
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
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  return (
    <div className="flex min-h-dvh flex-col bg-black">
      {isNavigating && (
        <Progress
          animated
          className="fixed top-0 right-0 left-0 z-[9999]"
          color="blue"
          size="xs"
          value={100}
        />
      )}
      <header className="flex items-center justify-between bg-black px-5 py-4 md:hidden">
        <a href="/">
          <LogoIcon />
        </a>
        <MobileMenuButton />
      </header>
      <div className="flex flex-1 bg-black">
        <SideMenu className="hidden md:flex" />
        <main className="min-w-0 flex-1 overflow-hidden bg-black">
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

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body className="overflow-x-hidden bg-black">
        <MantineProvider theme={mantineTheme}>
          <div className="flex min-h-dvh items-center justify-center bg-black text-white">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold">
                {isRouteErrorResponse(error)
                  ? `${String(error.status)} Error`
                  : "エラーが発生しました"}
              </h1>
              <p className="mb-8">
                {isRouteErrorResponse(error)
                  ? error.statusText
                  : "予期しないエラーが発生しました。"}
              </p>
              <a className="text-blue-400 underline" href="/">
                トップページに戻る
              </a>
            </div>
          </div>
        </MantineProvider>
        <Scripts />
      </body>
    </html>
  );
}
