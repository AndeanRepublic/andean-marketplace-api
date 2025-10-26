import { PersonType } from '../enums/PersonType';

export class Seller {
  constructor(
    public id: string,
    public typePerson: PersonType,
    public numberDocument: string,
    public ruc: string,
    public commercialName: string,
    public address: string,
    public phoneNumber: string,
    public email: string,
  ) {}
}
