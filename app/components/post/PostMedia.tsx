import type { ImageProps } from "@mantine/core";
import { Image } from "@mantine/core";

import type { Media } from "../../generated/api/schemas";

type PostMediaProps = {
  media: Media;
  imageProps?: Omit<ImageProps, "src" | "height" | "width">;
};

export const PostMedia = ({ media, imageProps }: PostMediaProps) => {
  switch (media.type) {
    case "photo":
    case "animated_gif":
      return (
        <Image
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
          height={media.height}
          preload="none"
          src={media.url}
          width={media.width}
          {...imageProps}
        />
      );
    default:
      return media.type satisfies never;
  }
};
