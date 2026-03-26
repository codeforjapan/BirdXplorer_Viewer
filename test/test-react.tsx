import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/ja";

import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { ReactElement } from "react";
import type React from "react";
import { MemoryRouter } from "react-router";
import type { ComponentRenderOptions } from "vitest-browser-react";
import { render } from "vitest-browser-react";

import { mantineTheme } from "~/config/mantine";

dayjs.extend(customParseFormat);

type CustomRenderOptions = Omit<ComponentRenderOptions, "wrapper"> & {
  initialEntries?: string[];
  initialIndex?: number;
};

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { initialEntries, initialIndex, ...rest } = options ?? {};

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        <MantineProvider theme={mantineTheme}>
          <DatesProvider settings={{ locale: "ja", consistentWeeks: true }}>
            {children}
          </DatesProvider>
        </MantineProvider>
      </MemoryRouter>
    );
  };

  return render(ui, { wrapper, ...rest });
};

export { customRender as render };
