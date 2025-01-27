import { Card, Group, Image, Text } from "@mantine/core";

import type { Post as APIPost } from "../../generated/api/schemas";

type PostProps = {
  post: APIPost;
};

export const Post = ({ post }: PostProps) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group gap="sm">
        <Image src={post.xUser.profileImage} alt="profile image" />
        <Text>{post.xUser.name}</Text>
        {post.mediaDetails?.map((media) => (
          <Image key={media.mediaKey} src={media.url} alt="media" />
        ))}
        <Text>{post.link}</Text>
      </Group>
    </Card>
  );
};
