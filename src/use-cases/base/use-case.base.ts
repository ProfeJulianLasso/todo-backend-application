export abstract class UseCaseBase<Aggregate = unknown> {
  protected readonly aggregate: Aggregate;

  constructor(aggregate: Aggregate) {
    this.aggregate = aggregate;
  }

  abstract execute(...data: unknown[]): unknown;
}
