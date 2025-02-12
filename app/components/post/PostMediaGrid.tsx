import type { Media } from "../../generated/api/schemas/media";
import { PostMedia } from "./PostMedia";

type PostMediaGridProps = {
  medias: Media[];
  postId: string;
};

// Twitter で 1 Post に紐付くメディアは 1 ～ 4
type ValidMediaArray =
  | [Media]
  | [Media, Media]
  | [Media, Media, Media]
  | [Media, Media, Media, Media];

const isMediaArrayLengthValid = (media: Media[]): media is ValidMediaArray => {
  return media.length > 0 && media.length <= 4;
};

export const PostMediaGrid = ({ medias, postId }: PostMediaGridProps) => {
  // メディアが4を超えることは X の仕様上ないはず
  if (!isMediaArrayLengthValid(medias)) return null;

  switch (medias.length) {
    case 1:
      return (
        <PostMedia
          imageProps={{ radius: "md" }}
          media={medias[0]}
          mediaIndex={1}
          postId={postId}
        />
      );
    case 2:
      return (
        <div className="grid grid-cols-2 gap-2">
          {medias.map((m, idx) => (
            <PostMedia
              imageProps={{ radius: "md" }}
              key={m.mediaKey}
              media={m}
              mediaIndex={(idx as 0 | 1) + 1}
              postId={postId}
            />
          ))}
        </div>
      );
    case 3:
    case 4:
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {medias.map((m, idx) => (
            <PostMedia
              imageProps={{ radius: "md" }}
              key={m.mediaKey}
              media={m}
              mediaIndex={(idx as 0 | 1 | 2 | 3) + 1}
              postId={postId}
            />
          ))}
        </div>
      );
    default:
      return medias satisfies never;
  }
};
