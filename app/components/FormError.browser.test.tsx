import "~/app.css";

import { TextInput } from "@mantine/core";
import { describe, expect, test } from "vitest";

import { render } from "../../test/test-react";
import { FormError } from "./FormError";

describe("FormError", () => {
  test("Input の error に渡したとき <ul> が <p> の中に入らない", async () => {
    const screen = await render(
      <TextInput
        error={<FormError errors={[["エラーその1", "エラーその2"]]} />}
        label="Test Input"
      />,
    );

    const list = screen.getByRole("list");
    await expect.element(list).toBeVisible();

    // Mantine の InputError はデフォルトで <p> を描画する。<p> の中の <ul> は
    // 不正な HTML ネストで SSR 時に hydration が壊れるため、テーマの
    // defaultProps（app/config/mantine.ts）で div に上書きしている。
    // このテストが落ちた場合、Mantine 側で component 上書きが効かなくなっている
    const errorElement = list
      .element()
      .closest('[class*="InputWrapper-error"]');
    expect(errorElement).not.toBeNull();
    expect(errorElement?.tagName).toBe("DIV");
  });
});
