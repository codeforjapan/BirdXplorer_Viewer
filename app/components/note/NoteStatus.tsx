import type { MantineColor } from "@mantine/core";
import { Badge } from "@mantine/core";

import { convertNoteStatusToLabel } from "../../feature/search/status";
import type { NoteCurrentStatus } from "../../generated/api/schemas";

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
