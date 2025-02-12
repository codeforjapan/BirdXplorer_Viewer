import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";

import { LANGUAGE_ID_TO_LABEL } from "../../feature/search/language";
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

  const languageLabel = LANGUAGE_ID_TO_LABEL[note.language];

  return (
    <Card padding="lg" radius="md" w="100%" withBorder>
      <Stack gap="md">
        <Stack gap="xs">
          <Text>{note.summary}</Text>
          <NoteStatus status={note.currentStatus} />
          <div className="grid grid-cols-[auto_1fr] gap-2 md:gap-4">
            <Badge color="blue" radius="sm" size="lg" variant="light">
              ノートの言語: {languageLabel}
            </Badge>
            <NoteTopic topics={note.topics} />
          </div>
          <Text size="sm">ノートの作成日時: {dateString}</Text>
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
