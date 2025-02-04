import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";

import type { SearchedNote } from "../../generated/api/schemas";
import { Post } from "../post/Post";
import { NoteStatus } from "./NoteStatus";
import { NoteTopic } from "./NoteTopics";

type NoteProps = {
  note: SearchedNote;
};

export const Note = ({ note }: NoteProps) => {
  const dateString = new Date(note.createdAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    timeZone: "Asia/Tokyo",
    minute: "2-digit",
  });

  return (
    <Card padding="lg" radius="md" withBorder>
      <Stack gap="sm">
        <Text>{note.summary}</Text>
        <NoteStatus status={note.currentStatus} />
        <Stack gap="xs">
          <div className="grid grid-cols-[auto_1fr] gap-2 md:gap-4">
            <Badge color="blue" radius="sm" size="lg" variant="light">
              言語
            </Badge>
            <NoteTopic
              topics={note.topics}
              wrapper={(props) => <Group gap="sm" {...props} />}
            />
          </div>
          <Text>{dateString}</Text>
        </Stack>
        <Post post={note.post} />
        <Group justify="flex-end">
          <Button
            color="pink"
            component="a"
            href={note.post.link}
            size="xs"
            target="_blank"
            variant="light"
          >
            ポストを見る
          </Button>
          <Button
            color="pink"
            component="a"
            href={`https://x.com/i/birdwatch/t/${note.post.postId}`}
            size="xs"
            target="_blank"
            variant="light"
          >
            このポストについたノートを見る
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};
