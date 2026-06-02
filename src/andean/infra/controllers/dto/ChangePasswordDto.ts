import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
	@ApiProperty({
		description: 'Current password',
		example: 'CurrentPassword123!',
	})
	@IsString()
	@IsNotEmpty()
	currentPassword: string;

	@ApiProperty({
		description: 'New password (minimum 8 characters)',
		example: 'NewSecurePass123!',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	newPassword: string;
}
