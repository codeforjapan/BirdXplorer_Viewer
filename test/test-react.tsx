import "dayjs/locale/ja";

import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { ReactElement } from "react";
import type React from "react";
import type { ComponentRenderOptions } from "vitest-browser-react";
import { render } from "vitest-browser-react";

import { mantineTheme } from "../app/config/mantine";

dayjs.extend(customParseFormat);

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider theme={mantineTheme}>
      <DatesProvider settings={{ locale: "ja", consistentWeeks: true }}>
        {children}
      </DatesProvider>
    </MantineProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<ComponentRenderOptions, "wrapper">,
) => render(ui, { wrapper, ...options });

export { customRender as render };
