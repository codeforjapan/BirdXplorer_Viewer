import type { TextInputProps as MantineTextInputProps } from "@mantine/core";
// このファイルは no-restricted-imports で提案される代替コンポーネントなので問題ない
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { TextInput as MantineTextInput } from "@mantine/core";

import { mantineInputOrder } from "~/config/mantine";

type TextInputProps = Omit<MantineTextInputProps, "inputWrapperOrder">;

export const TextInput = (props: TextInputProps) => {
  const { autoComplete, ...rest } = props;

  return (
    <MantineTextInput
      autoComplete={autoComplete}
      inputWrapperOrder={mantineInputOrder}
      {...(autoComplete === "off" && { "data-1p-ignore": true })}
      {...rest}
    />
  );
};
