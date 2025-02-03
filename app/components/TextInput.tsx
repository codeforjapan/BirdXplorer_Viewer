import type { TextInputProps } from "@mantine/core";
// このファイルは no-restricted-imports で提案される代替コンポーネントなので問題ない
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { TextInput as MantineTextInput } from "@mantine/core";

export const TextInput = (props: TextInputProps) => {
  const { autoComplete, ...rest } = props;

  return (
    <MantineTextInput
      autoComplete={autoComplete}
      {...(autoComplete === "off" && { "data-1p-ignore": true })}
      {...rest}
    />
  );
};
