import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
	@ApiProperty({
		description: 'JWT reset token obtained from the verify-reset-code endpoint',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@IsString()
	@IsNotEmpty()
	resetToken: string;

	@ApiProperty({
		description: 'New password (minimum 8 characters)',
		example: 'NewSecurePass123!',
	})
	@IsString()
	@MinLength(8)
	newPassword: string;
}
