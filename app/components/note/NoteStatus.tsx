import type { MantineColor } from "@mantine/core";
import { Badge } from "@mantine/core";

import type { NoteCurrentStatus } from "../../generated/api/schemas";

const convertNoteStatusToLabel = (status: NoteCurrentStatus) => {
  switch (status) {
    case null:
      return "このノートにはまだ評価がありません";
    case "CURRENTLY_RATED_HELPFUL":
      return "現在のところ「役に立った」と評価されています";
    case "CURRENTLY_RATED_NOT_HELPFUL":
      return "現在のところ「役に立たなかった」と評価されています";
    case "NEEDS_MORE_RATINGS":
      return "さらに評価が必要";
    default:
      return status satisfies never;
  }
};

const convertNoteStatusToColor = (status: NoteCurrentStatus): MantineColor => {
  switch (status) {
    case null:
      return "gray";
    case "CURRENTLY_RATED_HELPFUL":
      return "green";
    case "CURRENTLY_RATED_NOT_HELPFUL":
      return "yellow";
    case "NEEDS_MORE_RATINGS":
      return "blue";
    default:
      return status satisfies never;
  }
};

type NoteStatusProps = {
  status: NoteCurrentStatus;
};

export const NoteStatus = ({ status }: NoteStatusProps) => {
  return (
    <Badge color={convertNoteStatusToColor(status)} variant="light">
      {convertNoteStatusToLabel(status)}
    </Badge>
  );
};
