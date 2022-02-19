# prisma-cursor-pagination

Relay cursor pagination helpers for prisma.

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/prisma-cursor-pagination/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/prisma-cursor-pagination?style=for-the-badge)](https://www.npmjs.org/package/prisma-cursor-pagination)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/prisma-cursor-pagination?label=size&style=for-the-badge)](https://bundlephobia.com/result?p=prisma-cursor-pagination)

## Installation

```sh
$ npm i prisma-cursor-pagination --save
# --- or ---
$ yarn add prisma-cursor-pagination
```

## 📘 Usage

```ts
import { parsePaginationArgs } from "prisma-cursor-pagination";

const resolvers = {
  Query: {
    projects: async (_, args) => {
      // parse pagination arguments (first: Int! & after: ID / last: Int! & before: ID)
      const { findManyArgs, toConnection } = parsePaginationArgs(args);
      const projects = await prisma.project.findMany(findManyArgs);

      // transform prisma result into a relay connection
      return toConnection(projects);
    },

    users: async (_, args) => {
      const { findManyArgs, toConnection } = parsePaginationArgs(args);

      const [totalCount, users] = await Promise.all([
        prisma.user.count(),
        prisma.user.findMany(findManyArgs),
      ]);

      // add non-standard data in connection (here totalCount)
      return { totalCount, ...toConnection(users) };
    },
  },
};
```

## ⚙️ API

### parsePaginationArgs(args, options)

Take the query arguments and return prisma `findMany` arguments and a function to transform prisma result into a relay connection.

```ts
type parsePaginationArgs = (
  args: Partial<{
    first: number | null;
    after: string | null;
    last: number | null;
    before: string | null;
  }>,
  options: {
    connectionName?: string; // optional, used only to improve error message
  },
) => {
  findManyArgs: {
    cursor?: {
      id: string;
    };
    skip?: number;
    take: number;
  };
  toConnection: <T extends { id: string }>(
    items: T[],
  ) => {
    edges: Edge<T>[];
    pageInfo: PageInfo;
  };
};
```
