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

import type { Post as APIPost } from "../../generated/api/schemas";
import { PostMediaGrid } from "./PostMediaGrid";

type PostProps = {
  post: APIPost;
};

export const Post = ({ post }: PostProps) => {
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
    <Card withBorder>
      <Stack gap="xs">
        <Group gap="xs">
          <Avatar
            alt={`${post.xUser.name}のプロフィール画像`}
            imageProps={{ loading: "lazy", decoding: "async" }}
            size="sm"
            src={post.xUser.profileImage}
          />
          <Text fw="bolder">{post.xUser.name}</Text>
        </Group>
        <Text>{post.text}</Text>
        {post.links?.map((link, index) => (
          <a key={`${post.postId}link_${index}`} href={link.url}>
            <Text c="blue">{link.url}</Text>
          </a>
        ))}
        {post.mediaDetails != null && (
          <PostMediaGrid medias={post.mediaDetails} postId={post.postId} />
        )}
        <Text size="sm">{dateString}</Text>
        <Divider />
        <Group>
          <Text size="sm">
            いいね: <NumberFormatter thousandSeparator value={post.likeCount} />
          </Text>
          <Text size="sm">
            リポスト:{" "}
            <NumberFormatter thousandSeparator value={post.repostCount} />
          </Text>
          <Text size="sm">
            インプレッション:{" "}
            <NumberFormatter thousandSeparator value={post.impressionCount} />
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};
