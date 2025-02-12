import "./fieldset.css";

import type { FieldsetProps as MantineFieldsetProps } from "@mantine/core";
// このファイルは no-restricted-imports で提案される代替コンポーネントなので問題ない
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { Fieldset as MantineFieldSet } from "@mantine/core";
type FieldSetProps = Omit<MantineFieldsetProps, "variant">;

export const Fieldset = (props: FieldSetProps) => {
  return <MantineFieldSet variant="unstyled" {...props} />;
};
