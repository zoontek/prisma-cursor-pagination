export class InvalidPaginationError extends Error {
  constructor(
    public argumentName: "first" | "last",
    public connectionName?: string,
  ) {
    super(
      `\`${argumentName}\`` +
        (connectionName ? " on the `" + connectionName + "` connection" : "") +
        " cannot be less than zero.",
    );

    Object.setPrototypeOf(this, InvalidPaginationError.prototype);
    this.name = this.constructor.name;
  }
}
