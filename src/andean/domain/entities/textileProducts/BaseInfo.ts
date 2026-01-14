import { OwnerType } from '../../enums/OwnerType';

export class BaseInfo {
  constructor(
    public title: string,
    public media: string[],
    public description: string,
    public ownerType: OwnerType,
    public ownerId: string,
  ) {}
}
