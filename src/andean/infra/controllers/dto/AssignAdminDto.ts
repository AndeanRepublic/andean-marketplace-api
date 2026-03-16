import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignAdminDto {
	@ApiProperty({
		description: 'Email de la cuenta a la que se asignará el rol ADMIN',
		example: 'user@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email!: string;
}
