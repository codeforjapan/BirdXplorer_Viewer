export type Language =
  | "en"
  | "es"
  | "ja"
  | "pt"
  | "de"
  | "fr"
  | "fi"
  | "tr"
  | "nl"
  | "he"
  | "it"
  | "fa"
  | "ca"
  | "ar"
  | "el"
  | "sv"
  | "da"
  | "ru"
  | "pl"
  | "other"

export type NoteStatus =
  | "NEEDS_MORE_RATINGS"
  | "CURRENTLY_RATED_HELPFUL"
  | "	CURRENTLY_RATED_NOT_HELPFUL"

export type MediaType = "IMAGE" | "VIDEO" | "ALL"

export interface Filter {
  noteIncludeKeywords?: string
  noteExcludeKeywords?: string
  language?: Language
  topic_ids?: number[]
  note_current_status?: NoteStatus
  note_created_at_from?: number
  note_created_at_to?: number

  postIncludeKeywords?: string
  postExcludeKeywords?: string
  user_id?: string
  user_follower_count?: number
  user_following_count?: number
  post_like_count?: number
  post_repost_count?: number
  post_impression_count?: number
  post_created_at_from?: number
  post_created_at_to?: number
  media_type?: MediaType
}
