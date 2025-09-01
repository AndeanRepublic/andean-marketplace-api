import { TypePerson } from '../enums/TypePerson';

export class Seller {
  constructor(
    public id: string,
    public typePerson: TypePerson,
    public numberDocument: string,
    public ruc: string,
    public commercialName: string,
    public address: string,
    public phoneNumber: string,
    public email: string,
  ) {}
}
