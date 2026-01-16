import { TextileOptionsItem } from './TextileOptionsItem';

export class TextileOptions {
  constructor(
    public id: string,
    public name: string,
    public values: TextileOptionsItem[],
  ) {}
}
