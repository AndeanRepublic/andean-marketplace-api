export class TextileVariant {
  constructor(
    public id: string,
    public combination: Record<string, string>,
    public price: number,
    public stock: number,
  ) {}
}
