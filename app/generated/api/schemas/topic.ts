/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { TopicLabel } from "./topicLabel";

export interface Topic {
  /** トピックの言語ごとのラベル */
  label: TopicLabel;
  /**
   * このトピックに分類されたコミュニティノートの数
   * @minimum 0
   */
  referenceCount: number;
  /**
   * トピックの ID
   * @minimum 0
   */
  topicId: number;
}
