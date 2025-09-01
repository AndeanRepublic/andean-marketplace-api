import { CoinType } from '../enums/CoinType';

export class User {
  constructor(
    public id: string,
    public name: string,
    public country: string,
    public phoneNumber: string,
    public email: string,
    public language: string,
    public coin: CoinType,
  ) {}
}
