import { Card, Group, Image, Text } from "@mantine/core";

import type { Post as APIPost } from "../../generated/api/schemas";

type PostProps = {
  post: APIPost;
};

export const Post = ({ post }: PostProps) => {
  return (
    <Card padding="lg" radius="md" shadow="sm" withBorder>
      <Group gap="sm">
        <Image alt="profile image" src={post.xUser.profileImage} />
        <Text>{post.xUser.name}</Text>
        {post.mediaDetails?.map((media) => (
          <Image alt="media" key={media.mediaKey} src={media.url} />
        ))}
        <Text>{post.link}</Text>
      </Group>
    </Card>
  );
};
