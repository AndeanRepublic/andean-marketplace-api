import { AccountRole } from '../enums/AccountRole';

export interface Payload {
  sub: string;
  role: AccountRole;
}
