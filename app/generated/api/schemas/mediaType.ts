/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */

/**
 * メディアの種類
 */
export type MediaType = (typeof MediaType)[keyof typeof MediaType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MediaType = {
  photo: "photo",
  video: "video",
  animated_gif: "animated_gif",
} as const;
