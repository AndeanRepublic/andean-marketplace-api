import { ApiProperty } from '@nestjs/swagger';

export class SuperfoodCertificationResponse {
	@ApiProperty({ description: 'ID único de la certificación' })
	id: string;

	@ApiProperty({
		description: 'Nombre de la certificación',
		example: 'Orgánico',
	})
	name: string;

	@ApiProperty({ description: 'URL del icono', required: false })
	icon?: string;

	@ApiProperty({
		description: 'Entidad certificadora',
		required: false,
	})
	certifyingEntity?: string;

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt: Date;
}
