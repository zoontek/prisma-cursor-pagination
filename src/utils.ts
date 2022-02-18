export const getLastItem = <T>(value: T[]): T | undefined =>
  value[value.length - 1];

export const isNotNullish = <T>(value: T | null | undefined): value is T =>
  typeof value !== "undefined" && value !== null;
