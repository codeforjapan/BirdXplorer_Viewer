import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import type { Tweet } from "react-tweet/api";
import { EmbeddedTweet } from "react-tweet/patched/components/embedded-tweet";

import { LANGUAGE_ID_TO_LABEL } from "../../feature/search/language";
import {
  birdWatchLinkFromPostId,
  postLinkFromPostId,
} from "../../feature/twitter/link-builder";
import type { SearchedNote } from "../../generated/api/schemas";
import { isNonEmptyString } from "../../utils/string";
import { Post } from "../post/Post";
import { NoteStatus } from "./NoteStatus";
import { NoteTopic } from "./NoteTopics";

type NoteProps = {
  note: SearchedNote;
  fetchedPost: Tweet | undefined;
};

export const Note = ({ note, fetchedPost }: NoteProps) => {
  const dateString = useMemo(() => {
    return new Date(note.createdAt).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      timeZone: "Asia/Tokyo",
      minute: "2-digit",
    });
  }, [note.createdAt]);

  const languageLabel = LANGUAGE_ID_TO_LABEL[note.language];

  return (
    <Card
      className="content-visibility-auto"
      component="article"
      padding="lg"
      radius="md"
      w="100%"
      withBorder
    >
      <Stack gap="md">
        <Group className="text-sm text-zinc-600" justify="space-between">
          <span>NoteID: {note.noteId}</span>
          <span>ノートの作成日時: {dateString}</span>
        </Group>
        <Stack gap="xs">
          <Text className="break-words">{note.summary}</Text>
          <NoteStatus status={note.currentStatus} />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[auto_1fr] md:gap-4">
            <Badge
              className="min-w-fit"
              color="blue"
              radius="sm"
              size="lg"
              variant="light"
            >
              ノートの言語: {languageLabel}
            </Badge>
            <NoteTopic topics={note.topics} />
          </div>
        </Stack>
        {note.post != null ? (
          <Post post={note.post} />
        ) : fetchedPost != null ? (
          <div data-theme="light">
            <EmbeddedTweet tweet={fetchedPost} />
          </div>
        ) : null}
        {isNonEmptyString(note.postId) && (
          <Group justify="flex-end">
            <Button
              color="pink"
              component="a"
              href={postLinkFromPostId(note.postId)}
              size="xs"
              target="_blank"
              variant="light"
            >
              ポストを見る
            </Button>
            <Button
              color="pink"
              component="a"
              href={birdWatchLinkFromPostId(note.postId)}
              size="xs"
              target="_blank"
              variant="light"
            >
              このポストについたノートを見る
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
};
