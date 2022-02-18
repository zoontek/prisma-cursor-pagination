export type PaginationArgs = Partial<{
  first: number | null;
  after: string | null;
  last: number | null;
  before: string | null;
}>;

export type ParsePaginationArgsOptions = {
  connectionName?: string;
};

export type FindManyArgs = {
  cursor?: {
    id: string;
  };
  skip?: number;
  take: number;
};

export type Edge<T extends { id: string }> = {
  cursor: string;
  node: T;
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
  hasPreviousPage: boolean;
  startCursor: string | null;
};

export type Connection<T extends { id: string }> = {
  edges: Edge<T>[];
  pageInfo: PageInfo;
};
