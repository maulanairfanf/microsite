export const RefreshStatus = {
  Active: "active",
  Pending: "pending",
  Expired: "expired",
  NotFound: "not_found",
  Unknown: "unknown",
} as const;
export type RefreshStatus = (typeof RefreshStatus)[keyof typeof RefreshStatus];
