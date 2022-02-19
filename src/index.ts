import {
  InvalidPaginationError,
  MissingPaginationBoundariesError,
} from "./errors";
import {
  Connection,
  FindManyArgs,
  PaginationArgs,
  ParsePaginationArgsOptions,
} from "./types";

export * from "./errors";
export * from "./types";

const isNotNullish = <T>(value: T | null | undefined): value is T =>
  typeof value !== "undefined" && value !== null;

const getLastItem = <T>(value: T[]): T | undefined => value[value.length - 1];

export const parsePaginationArgs = (
  { first, after, last, before }: PaginationArgs,
  { connectionName }: ParsePaginationArgsOptions = {},
): {
  findManyArgs: FindManyArgs;
  toConnection: <T extends { id: string }>(items: T[]) => Connection<T>;
} => {
  if (isNotNullish(first)) {
    if (first < 0) {
      throw new InvalidPaginationError("first", connectionName);
    }

    const cursor = isNotNullish(after) ? { id: after } : undefined;
    const take = first + 1; // include one extra item to set hasNextPage value
    const skip = isNotNullish(cursor) ? 1 : undefined; // prisma will include the cursor if skip: 1 is not set

    return {
      findManyArgs: { cursor, skip, take },
      toConnection: (items) => {
        const copy = [...items]; // avoid mutations on original array
        const hasNextPage = copy.length === take;

        if (hasNextPage) {
          copy.pop();
        }

        return {
          edges: copy.map((item) => ({ cursor: item.id, node: item })),
          pageInfo: {
            hasNextPage,
            endCursor: getLastItem(copy)?.id ?? null,
            hasPreviousPage: false,
            startCursor: copy[0]?.id ?? null,
          },
        };
      },
    };
  }

  if (isNotNullish(last)) {
    if (last < 0) {
      throw new InvalidPaginationError("last", connectionName);
    }

    const cursor = isNotNullish(before) ? { id: before } : undefined;
    const take = last + 1; // include one extra item to set hasPreviousPage value
    const skip = isNotNullish(cursor) ? 1 : undefined; // prisma will include the cursor if skip: 1 is not set

    return {
      findManyArgs: { cursor, skip, take: -take },
      toConnection: (items) => {
        const copy = [...items]; // avoid mutations on original array
        const hasPreviousPage = copy.length === take;

        if (hasPreviousPage) {
          copy.shift();
        }

        return {
          edges: copy.map((item) => ({ cursor: item.id, node: item })),
          pageInfo: {
            hasNextPage: false,
            endCursor: getLastItem(copy)?.id ?? null,
            hasPreviousPage,
            startCursor: copy[0]?.id ?? null,
          },
        };
      },
    };
  }

  throw new MissingPaginationBoundariesError(connectionName);
};
