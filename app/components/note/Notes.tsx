import { memo } from "react";

import type { SearchedNote } from "~/generated/api/schemas";

import { Note } from "./Note";

type NotesProps = {
  notes: SearchedNote[];
};

export const Notes = memo(({ notes }: NotesProps) => {
  return (
    <>
      {notes.map((note) => (
        <Note key={note.noteId} note={note} />
      ))}
    </>
  );
});
Notes.displayName = "Notes";
