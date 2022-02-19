export class InvalidPaginationError extends Error {
  constructor(
    public argumentName: "first" | "last",
    public connectionName?: string,
  ) {
    super(
      `\`${argumentName}\` on${
        connectionName ? ` the \`${connectionName}\` ` : " "
      }connection cannot be less than zero.`,
    );

    Object.setPrototypeOf(this, InvalidPaginationError.prototype);
    this.name = this.constructor.name;
  }
}

export class MissingPaginationBoundariesError extends Error {
  constructor(public connectionName?: string) {
    super(
      `You must provide a \`first\` or \`last\` value to properly paginate${
        connectionName ? ` the \`${connectionName}\` ` : " "
      }connection.`,
    );

    Object.setPrototypeOf(this, InvalidPaginationError.prototype);
    this.name = this.constructor.name;
  }
}
