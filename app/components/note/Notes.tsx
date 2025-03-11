import { memo } from "react";
import type { Tweet } from "react-tweet/api";

import type { SearchedNote } from "../../generated/api/schemas";
import { Note } from "./Note";

type NotesProps = {
  notes: SearchedNote[];
  fetchedPosts: Record<string, Tweet>;
};

export const Notes = memo(({ notes, fetchedPosts }: NotesProps) => {
  return (
    <>
      {notes.map((note) => (
        <Note
          fetchedPost={fetchedPosts[note.postId]}
          key={note.noteId}
          note={note}
        />
      ))}
    </>
  );
});
Notes.displayName = "Notes";
