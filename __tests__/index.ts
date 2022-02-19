import {
  FindManyArgs,
  InvalidPaginationError,
  MissingPaginationBoundariesError,
  parsePaginationArgs,
} from "../src";

const USER_1 = {
  id: "6f8cb8fa-c9e5-4a54-b5a6-220debb92bd1",
  lastName: "Glover",
  firstName: "Tamia",
};

const USER_2 = {
  id: "853b8ca5-a7a1-416e-a4fa-1efa39e9ba13",
  lastName: "Marks",
  firstName: "Marlen",
};

const USER_3 = {
  id: "d3fffeeb-5838-4e06-867c-f5251b62454f",
  lastName: "Kunze",
  firstName: "Kiana",
};

const USER_4 = {
  id: "b59bdfc8-8611-4f63-aff2-205587754308",
  lastName: "Botsford",
  firstName: "Miller",
};

const USER_5 = {
  id: "6a24d1e2-d81d-403b-a023-a8791f2dc060",
  lastName: "Howell",
  firstName: "Alphonso",
};

const USERS = [USER_1, USER_2, USER_3, USER_4, USER_5];
const USERS_REVERSED = [...USERS].reverse();

const findMany = ({ cursor, skip = 0, take }: FindManyArgs) => {
  const forward = take >= 0;
  const users = forward ? USERS : USERS_REVERSED;

  const index = cursor ? users.findIndex((user) => user.id === cursor.id) : 0;
  const start = index + skip;
  const end = start + Math.abs(take);
  const output = users.slice(start, end);

  return forward ? output : output.reverse();
};

describe("forward pagination", () => {
  test("first page", () => {
    const { findManyArgs, toConnection } = parsePaginationArgs({ first: 2 });

    const results = findMany(findManyArgs);
    expect(results).toEqual([USER_1, USER_2, USER_3]);

    const connection = toConnection(results);
    expect(connection).toEqual({
      edges: [
        { cursor: USER_1.id, node: USER_1 },
        { cursor: USER_2.id, node: USER_2 },
      ],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: true,
        startCursor: USER_1.id,
        endCursor: USER_2.id,
      },
    });
  });

  test("second page", () => {
    const { findManyArgs, toConnection } = parsePaginationArgs({
      first: 2,
      after: USER_2.id,
    });

    const results = findMany(findManyArgs);
    expect(results).toEqual([USER_3, USER_4, USER_5]);

    const connection = toConnection(results);
    expect(connection).toEqual({
      edges: [
        { cursor: USER_3.id, node: USER_3 },
        { cursor: USER_4.id, node: USER_4 },
      ],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: true,
        startCursor: USER_3.id,
        endCursor: USER_4.id,
      },
    });
  });

  test("third page", () => {
    const { findManyArgs, toConnection } = parsePaginationArgs({
      first: 2,
      after: USER_4.id,
    });

    const results = findMany(findManyArgs);
    expect(results).toEqual([USER_5]);

    const connection = toConnection(results);
    expect(connection).toEqual({
      edges: [{ cursor: USER_5.id, node: USER_5 }],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: USER_5.id,
        endCursor: USER_5.id,
      },
    });
  });
});

describe("backward pagination", () => {
  test("first page", () => {
    const { findManyArgs, toConnection } = parsePaginationArgs({ last: 2 });

    const results = findMany(findManyArgs);
    expect(results).toEqual([USER_3, USER_4, USER_5]);

    const connection = toConnection(results);
    expect(connection).toEqual({
      edges: [
        { cursor: USER_4.id, node: USER_4 },
        { cursor: USER_5.id, node: USER_5 },
      ],
      pageInfo: {
        hasPreviousPage: true,
        hasNextPage: false,
        startCursor: USER_4.id,
        endCursor: USER_5.id,
      },
    });
  });

  test("second page", () => {
    const { findManyArgs, toConnection } = parsePaginationArgs({
      last: 2,
      before: USER_4.id,
    });

    const results = findMany(findManyArgs);
    expect(results).toEqual([USER_1, USER_2, USER_3]);

    const connection = toConnection(results);
    expect(connection).toEqual({
      edges: [
        { cursor: USER_2.id, node: USER_2 },
        { cursor: USER_3.id, node: USER_3 },
      ],
      pageInfo: {
        hasPreviousPage: true,
        hasNextPage: false,
        startCursor: USER_2.id,
        endCursor: USER_3.id,
      },
    });
  });

  test("third page", () => {
    const { findManyArgs, toConnection } = parsePaginationArgs({
      last: 2,
      before: USER_2.id,
    });

    const results = findMany(findManyArgs);
    expect(results).toEqual([USER_1]);

    const connection = toConnection(results);
    expect(connection).toEqual({
      edges: [{ cursor: USER_1.id, node: USER_1 }],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: USER_1.id,
        endCursor: USER_1.id,
      },
    });
  });
});

describe("missing arguments", () => {
  test("throw InvalidPaginationError if first < 0", () => {
    try {
      parsePaginationArgs({ first: 0 });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidPaginationError);
    }
  });

  test("throw InvalidPaginationError if last < 0", () => {
    try {
      parsePaginationArgs({ last: 0 });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidPaginationError);
    }
  });

  test("throw MissingPaginationBoundariesError if first and last are not defined", () => {
    try {
      parsePaginationArgs({});
    } catch (error) {
      expect(error).toBeInstanceOf(MissingPaginationBoundariesError);
    }
  });
});
