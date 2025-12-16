import {
  Avatar,
  Card,
  Divider,
  Group,
  NumberFormatter,
  Stack,
  Text,
} from "@mantine/core";
import { useMemo } from "react";

import type { SearchedNotePost as APIPost } from "~/generated/api/schemas";

import { PostMediaGrid } from "./PostMediaGrid";

type PostProps = {
  post: APIPost;
};

export const Post = ({ post }: PostProps) => {
  if (!post) return null

  const dateString = useMemo(() => {
    return new Date(post.createdAt).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      timeZone: "Asia/Tokyo",
      minute: "2-digit",
    });
  }, [post.createdAt]);

  return (
    <Card
      bg="var(--color-twitter-dark-1)"
      className="border !border-gray-5"
      withBorder
    >
      <Stack gap="xs">
        <Group gap="xs">
          <Avatar
            alt={`${post.xUser.name}のプロフィール画像`}
            imageProps={{ loading: "lazy", decoding: "async" }}
            size="sm"
            src={post.xUser.profileImage}
          />
          <Text fw="bolder" c="white">
            {post.xUser.name}
          </Text>
        </Group>
        <Text c="white" className="break-words">
          {post.text}
        </Text>
        {post.links?.map((link, index) => (
          <a href={link.url} key={`${post.postId}link_${index}`}>
            <Text c="white">{link.url}</Text>
          </a>
        ))}
        {post.mediaDetails != null && (
          <PostMediaGrid medias={post.mediaDetails} postId={post.postId} />
        )}
        <Text c="white" size="sm">
          {dateString}
        </Text>
        <Divider />
        <Group>
          <Text c="white" size="sm">
            いいね: <NumberFormatter thousandSeparator value={post.likeCount} />
          </Text>
          <Text c="white" size="sm">
            リポスト:{" "}
            <NumberFormatter thousandSeparator value={post.repostCount} />
          </Text>
          <Text c="white" size="sm">
            インプレッション:{" "}
            <NumberFormatter thousandSeparator value={post.impressionCount} />
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};
