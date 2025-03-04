import type { Note } from "../../generated/api/schemas";

export const birdWatchLinkFromNote = (note: Note): string => {
  return `https://x.com/i/birdwatch/t/${note.postId}`;
};

export const postLinkFromNote = (note: Note): string => {
  // X redirects to correct post url regardless of userId, so just specify `i`
  return `https://x.com/i/status/${note.postId}`;
};
