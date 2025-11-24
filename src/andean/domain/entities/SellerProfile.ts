import { PersonType } from '../enums/PersonType';

export class SellerProfile {
  constructor(
    public id: string,
    public userId: string,
    public name: string,
    public typePerson: PersonType,
    public numberDocument: string,
    public ruc: string,
    public commercialName: string,
    public address: string,
    public phoneNumber: string,
  ) {}
}
