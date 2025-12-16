import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import { useMemo } from "react";

import { Post } from "~/components/post/Post";
import { LANGUAGE_ID_TO_LABEL } from "~/feature/search/language";
import {
  birdWatchLinkFromPostId,
  postLinkFromPostId,
} from "~/feature/twitter/link-builder";
import type { SearchedNote } from "~/generated/api/schemas";
import { isNonEmptyString } from "~/utils/string";

import { NoteStatus } from "./NoteStatus";
import { NoteTopic } from "./NoteTopics";

type NoteProps = {
  note: SearchedNote;
};

export const Note = ({ note }: NoteProps) => {
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
      bg="var(--color-twitter-dark-1)"
      className="content-visibility-auto"
      component="article"
      padding="lg"
      radius="md"
      w="100%"
    >
      <Stack gap="md">
        <Group className="text-sm text-white" justify="space-between">
          <span>NoteID: {note.noteId}</span>
          <span>ノートの作成日時: {dateString}</span>
        </Group>
        <Stack gap="xs">
          <Text c="white" className="break-words">
            {note.summary}
          </Text>
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
        <Post post={note.post} />
        {
          // ref: https://github.com/codeforjapan/BirdXplorer_Viewer/pull/32#discussion_r1978997326
          // API 側で Post 情報を非同期に取得する仕様変更が予定されているが、誤って postId が null になってしまう場合がありえるので
          // 予防的に分岐を入れている。Note.postId の存在が保証されている場合は分岐を削除して良い。
          isNonEmptyString(note.postId) && (
            <Group justify="flex-end">
              <Button
                color="white"
                component="a"
                href={postLinkFromPostId(note.postId)}
                size="xs"
                target="_blank"
                variant="light"
              >
                ポストを見る
              </Button>
              <Button
                color="white"
                component="a"
                href={birdWatchLinkFromPostId(note.postId)}
                size="xs"
                target="_blank"
                variant="light"
              >
                このポストについたノートを見る
              </Button>
            </Group>
          )
        }
      </Stack>
    </Card>
  );
};
