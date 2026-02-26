import { ExperienceMediaInfo } from 'src/andean/domain/entities/experiences/ExperienceMediaInfo';
import { instanceToPlain, plainToInstance } from 'class-transformer';

// Value Object mapper — sin fromDocument ya que no es una colección propia
export class ExperienceMediaInfoMapper {
	/**
	 * Desde el subdocumento embebido del documento padre (MongoDB plain object)
	 */
	static fromPlain(plain: any): ExperienceMediaInfo {
		return plainToInstance(ExperienceMediaInfo, plain);
	}

	/**
	 * Desde el DTO de creación/actualización
	 */
	static fromDto(dto: any): ExperienceMediaInfo {
		return plainToInstance(ExperienceMediaInfo, dto);
	}

	/**
	 * Para persistencia embebida — serializa como objeto plano (sin excluir nada,
	 * ya que es un sub-documento sin _id)
	 */
	static toPersistence(entity: ExperienceMediaInfo | Partial<ExperienceMediaInfo>) {
		return instanceToPlain(entity);
	}
}
