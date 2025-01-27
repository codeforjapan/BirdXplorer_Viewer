import type { ButtonProps, PolymorphicComponentProps } from "@mantine/core";
import { Button } from "@mantine/core";
import type React from "react";

type SubmitButtonProps = Omit<
  PolymorphicComponentProps<"button", ButtonProps>,
  "type"
> & {
  children: React.ReactNode;
};

export const SubmitButton = ({ disabled, ...rest }: SubmitButtonProps) => {
  // React19 へアップデートしたら useFormStatus() を追加して送信中はボタンを無効化することを検討する

  return <Button disabled={disabled} type="submit" {...rest} />;
};
