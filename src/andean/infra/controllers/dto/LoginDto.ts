import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
	@ApiProperty({
		description: 'Email o nombre de usuario',
		example: 'user@example.com',
	})
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({
		description: 'Contraseña del usuario',
		example: 'SecurePassword123!',
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}
