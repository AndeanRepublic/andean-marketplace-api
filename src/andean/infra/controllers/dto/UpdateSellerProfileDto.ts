import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PersonType } from '../../../domain/enums/PersonType';

export class UpdateSellerProfileDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	phoneNumber: string;

	@IsString()
	@IsNotEmpty()
	numberDocument: string;

	@IsString()
	ruc: string;

	@IsEnum(PersonType)
	@IsNotEmpty()
	typePerson: PersonType;

	@IsString()
	@IsNotEmpty()
	country: string;

	@IsString()
	@IsNotEmpty()
	commercialName: string;

	@IsString()
	@IsNotEmpty()
	address: string;
}
