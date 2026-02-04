import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	HttpCode,
	HttpStatus,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiConsumes,
	ApiBody,
} from '@nestjs/swagger';
import { UploadMediaItemUseCase } from '../../app/use_cases/media/UploadMediaItemUseCase';
import { UpdateMediaItemUseCase } from '../../app/use_cases/media/UpdateMediaItemUseCase';
import { GetMediaItemByIdUseCase } from '../../app/use_cases/media/GetMediaItemByIdUseCase';
import { ListMediaItemsUseCase } from '../../app/use_cases/media/ListMediaItemsUseCase';
import { DeleteMediaItemUseCase } from '../../app/use_cases/media/DeleteMediaItemUseCase';
import { UploadMediaItemDto } from './dto/media/UploadMediaItemDto';
import { UpdateMediaItemDto } from './dto/media/UpdateMediaItemDto';
import { MediaItemResponse } from '../../app/modules/MediaItemResponse';
import { MediaItem } from '../../domain/entities/MediaItem';

@ApiTags('Media Items')
@Controller('media-items')
export class MediaItemController {
	constructor(
		private readonly uploadMediaItemUseCase: UploadMediaItemUseCase,
		private readonly updateMediaItemUseCase: UpdateMediaItemUseCase,
		private readonly getMediaItemByIdUseCase: GetMediaItemByIdUseCase,
		private readonly listMediaItemsUseCase: ListMediaItemsUseCase,
		private readonly deleteMediaItemUseCase: DeleteMediaItemUseCase,
	) { }

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Subir y crear un nuevo media item' })
	@ApiBody({
		schema: {
			type: 'object',
			required: ['file', 'type', 'name'],
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description: 'Archivo a subir (imagen)',
				},
				type: {
					type: 'string',
					description: 'Tipo/carpeta (ej: products, avatars, banners)',
					example: 'products',
				},
				name: {
					type: 'string',
					description: 'Nombre del archivo',
					example: 'quinoa-roja.png',
				},
			},
		},
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Media item creado y subido exitosamente a S3',
		type: MediaItemResponse,
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Archivo inválido o datos incorrectos',
	})
	async upload(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
					new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
				],
			}),
		)
		file: Express.Multer.File,
		@Body() dto: UploadMediaItemDto,
	): Promise<MediaItemResponse> {
		const mediaItem = await this.uploadMediaItemUseCase.execute({
			file,
			type: dto.type,
			name: dto.name,
		});
		return this.toResponse(mediaItem);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar un media item' })
	@ApiParam({ name: 'id', description: 'ID del media item' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Media item actualizado exitosamente',
		type: MediaItemResponse,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Media item no encontrado',
	})
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateMediaItemDto,
	): Promise<MediaItemResponse> {
		const mediaItem = await this.updateMediaItemUseCase.execute(id, dto);
		return this.toResponse(mediaItem);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener un media item por ID' })
	@ApiParam({ name: 'id', description: 'ID del media item' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Media item encontrado',
		type: MediaItemResponse,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Media item no encontrado',
	})
	async getById(@Param('id') id: string): Promise<MediaItemResponse> {
		const mediaItem = await this.getMediaItemByIdUseCase.execute(id);
		return this.toResponse(mediaItem);
	}

	@Get()
	@ApiOperation({ summary: 'Listar todos los media items' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Lista de media items',
		type: [MediaItemResponse],
	})
	async list(): Promise<MediaItemResponse[]> {
		const mediaItems = await this.listMediaItemsUseCase.execute();
		return mediaItems.map((item) => this.toResponse(item));
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Eliminar un media item' })
	@ApiParam({ name: 'id', description: 'ID del media item' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Media item eliminado exitosamente',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Media item no encontrado',
	})
	async delete(@Param('id') id: string): Promise<void> {
		await this.deleteMediaItemUseCase.execute(id);
	}

	private toResponse(mediaItem: MediaItem): MediaItemResponse {
		return {
			id: mediaItem.id,
			type: mediaItem.type,
			name: mediaItem.name,
			url: mediaItem.url,
			createdAt: mediaItem.createdAt!,
			updatedAt: mediaItem.updatedAt!,
		};
	}
}
