export class TraceabilityEpoch {
  constructor(
    public id: string,
    public step: number,
    public title: string,
    public origin: any,
    public description: string,
    public processName: string,
    public supplier: string,
  ) {}
}
