import type { z } from "zod";
import type { noteSearchParamSchema } from "./validation";

export type NoteSearchParams = z.infer<typeof noteSearchParamSchema>;
