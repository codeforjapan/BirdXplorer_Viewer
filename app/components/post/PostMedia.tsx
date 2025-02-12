import type { ImageProps } from "@mantine/core";
import { Image } from "@mantine/core";

import type { Media } from "../../generated/api/schemas";

type PostMediaProps = {
  media: Media;
  imageProps?: Omit<ImageProps, "src" | "height" | "width">;
  mediaIndex: number;
  postId: string;
};

export const PostMedia = ({
  media,
  mediaIndex,
  postId,
  imageProps,
}: PostMediaProps) => {
  switch (media.type) {
    case "photo":
    case "animated_gif":
      return (
        <Image
          alt={`Post ${postId}'s image, ${mediaIndex} of 4`}
          decoding="async"
          height={media.height}
          loading="lazy"
          src={media.url}
          width={media.width}
          {...imageProps}
        />
      );
    case "video":
      return (
        <Image
          component="video"
          controls
          height={media.height}
          preload="none"
          src={media.url}
          width={media.width}
          {...imageProps}
        >
          <span>
            Post {postId}&apos;s video, {mediaIndex} of 4
          </span>
        </Image>
      );
    default:
      return media.type satisfies never;
  }
};
