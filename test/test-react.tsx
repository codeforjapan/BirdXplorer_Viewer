import "dayjs/locale/ja";

import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { ReactElement } from "react";
import type React from "react";

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
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper, ...options });

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { customRender as render };
