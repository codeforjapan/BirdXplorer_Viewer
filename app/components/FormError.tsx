import type { MantineSize } from "@mantine/core";
import { List, ListItem } from "@mantine/core";
import { useMemo } from "react";

type FormErrorProps = {
  errors: Array<string[] | null | undefined> | string[] | null | undefined;
  /**
   * @default "xs"
   */
  size?: MantineSize;
};

export const FormError = ({ errors, size }: FormErrorProps) => {
  size ??= "xs";

  const flattenErrors = useMemo(
    () => errors?.flat().filter((v) => v != null),
    [errors]
  );
  if (flattenErrors == null || flattenErrors.length === 0) {
    return undefined;
  }

  return (
    <List size={size} listStyleType="none">
      {flattenErrors.map((error, index) => (
        <ListItem key={index}>{error}</ListItem>
      ))}
    </List>
  );
};
