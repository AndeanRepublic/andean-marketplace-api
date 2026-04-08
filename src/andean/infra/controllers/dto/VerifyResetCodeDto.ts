import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetCodeDto {
	@ApiProperty({
		description: 'Email address associated with the reset code',
		example: 'user@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: '6-digit reset code received by email',
		example: '482910',
	})
	@IsString()
	@Matches(/^[0-9]{6}$/, { message: 'Code must be exactly 6 digits' })
	code: string;
}
