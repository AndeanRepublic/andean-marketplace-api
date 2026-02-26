import { ExperienceDetailInfo } from 'src/andean/domain/entities/experiences/ExperienceDetailInfo';
import { instanceToPlain, plainToInstance } from 'class-transformer';

// Value Object mapper — sin fromDocument ya que no es una colección propia
export class ExperienceDetailInfoMapper {
	/**
	 * Desde el subdocumento embebido del documento padre (MongoDB plain object)
	 */
	static fromPlain(plain: any): ExperienceDetailInfo {
		return plainToInstance(ExperienceDetailInfo, plain);
	}

	/**
	 * Desde el DTO de creación/actualización
	 */
	static fromDto(dto: any): ExperienceDetailInfo {
		return plainToInstance(ExperienceDetailInfo, dto);
	}

	/**
	 * Para persistencia embebida — serializa como objeto plano (sin excluir nada,
	 * ya que es un sub-documento sin _id)
	 */
	static toPersistence(entity: ExperienceDetailInfo | Partial<ExperienceDetailInfo>) {
		return instanceToPlain(entity);
	}
}
