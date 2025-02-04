import { Card, Group, Text } from "@mantine/core";

import type { SearchedNote } from "../../generated/api/schemas";
import { Post } from "../post/Post";
import { NoteStatus } from "./NoteStatus";
import { NoteTopic } from "./NoteTopics";

type NoteProps = {
  note: SearchedNote;
};

export const Note = ({ note }: NoteProps) => {
  const dateString = new Date(note.createdAt).toLocaleString("ja-JP");

  return (
    <Card padding="lg" radius="md" shadow="sm" withBorder>
      <Group gap="sm">
        <Group gap="xs">
          <Text>{note.summary}</Text>
          <NoteStatus status={note.currentStatus} />
          <NoteTopic
            topics={note.topics}
            wrapper={(props) => <Group {...props} />}
          />
          <Text c="dimmed" size="sm">
            Created At: {dateString}
          </Text>
        </Group>
        <Post post={note.post} />
      </Group>
    </Card>
  );
};
