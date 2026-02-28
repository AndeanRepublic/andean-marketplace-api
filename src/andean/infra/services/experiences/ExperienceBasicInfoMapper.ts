import { ExperienceBasicInfo } from 'src/andean/domain/entities/experiences/ExperienceBasicInfo';
import { instanceToPlain, plainToInstance } from 'class-transformer';

// Value Object mapper — sin fromDocument ya que no es una colección propia
export class ExperienceBasicInfoMapper {
	/**
	 * Desde el subdocumento embebido del documento padre (MongoDB plain object)
	 */
	static fromPlain(plain: any): ExperienceBasicInfo {
		return plainToInstance(ExperienceBasicInfo, plain);
	}

	/**
	 * Desde el DTO de creación/actualización
	 */
	static fromDto(dto: any): ExperienceBasicInfo {
		return plainToInstance(ExperienceBasicInfo, dto);
	}

	/**
	 * Para persistencia embebida — serializa como objeto plano (sin excluir nada,
	 * ya que es un sub-documento sin _id)
	 */
	static toPersistence(
		entity: ExperienceBasicInfo | Partial<ExperienceBasicInfo>,
	) {
		return instanceToPlain(entity);
	}
}
