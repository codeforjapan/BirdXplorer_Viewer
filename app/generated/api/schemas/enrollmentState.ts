/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */

export type EnrollmentState =
  (typeof EnrollmentState)[keyof typeof EnrollmentState];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EnrollmentState = {
  newUser: "newUser",
  earnedIn: "earnedIn",
  atRisk: "atRisk",
  earnedOutAcknowledged: "earnedOutAcknowledged",
  earnedOutNoAcknowledge: "earnedOutNoAcknowledge",
} as const;
