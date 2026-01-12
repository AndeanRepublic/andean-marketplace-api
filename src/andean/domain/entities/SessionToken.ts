import { ApiProperty } from '@nestjs/swagger';

export class SessionToken {
	@ApiProperty({
		description: 'Token JWT para autenticación',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
	})
	public token: string;

	@ApiProperty({
		description: 'Duración del token en segundos',
		example: 3600
	})
	public duration: number;

	constructor(token: string, duration: number) {
		this.token = token;
		this.duration = duration;
	}
}
