import {
  Avatar,
  Card,
  Divider,
  Group,
  NumberFormatter,
  Stack,
  Text,
} from "@mantine/core";

import type { Post as APIPost } from "../../generated/api/schemas";
import { PostMediaGrid } from "./PostMediaGrid";

type PostProps = {
  post: APIPost;
};

export const Post = ({ post }: PostProps) => {
  const dateString = new Date(post.createdAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    timeZone: "Asia/Tokyo",
    minute: "2-digit",
  });

  return (
    <Card withBorder>
      <Stack gap="sm">
        <Group gap="xs">
          <Avatar
            alt={`${post.xUser.name}のプロフィール画像`}
            size="sm"
            src={post.xUser.profileImage}
          />
          <Text>{post.xUser.name}</Text>
        </Group>
        <Text>{post.text}</Text>
        {post.mediaDetails != null && (
          <PostMediaGrid medias={post.mediaDetails} />
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
