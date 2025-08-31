export class SessionToken {
  constructor(
    public token: string,
    public durationSeconds: number,
  ) {}
}
