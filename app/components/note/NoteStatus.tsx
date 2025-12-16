import type { MantineColor } from "@mantine/core";
import { Indicator, Text } from "@mantine/core";

import { convertNoteStatusToLabel } from "~/feature/search/status";
import type { NoteCurrentStatus } from "~/generated/api/schemas";

const convertNoteStatusToColor = (status: NoteCurrentStatus): MantineColor => {
  switch (status) {
    case null:
      return "gray";
    case "CURRENTLY_RATED_HELPFUL":
      return "green";
    case "CURRENTLY_RATED_NOT_HELPFUL":
      return "pink";
    case "NEEDS_MORE_RATINGS":
      return "yellow";
    default:
      return status satisfies never;
  }
};

type NoteStatusProps = {
  status: NoteCurrentStatus;
};

export const NoteStatus = ({ status }: NoteStatusProps) => {
  return (
    <Indicator
      className="ms-2"
      color={convertNoteStatusToColor(status)}
      inline
      position="middle-start"
      size={16}
      withBorder
    >
      <Text c="white" ms={16} size="sm">
        {convertNoteStatusToLabel(status)}
      </Text>
    </Indicator>
  );
};
