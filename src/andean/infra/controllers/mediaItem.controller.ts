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
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
} from '@nestjs/swagger';
import { CreateMediaItemUseCase } from '../../app/use_cases/media/CreateMediaItemUseCase';
import { UpdateMediaItemUseCase } from '../../app/use_cases/media/UpdateMediaItemUseCase';
import { GetMediaItemByIdUseCase } from '../../app/use_cases/media/GetMediaItemByIdUseCase';
import { ListMediaItemsUseCase } from '../../app/use_cases/media/ListMediaItemsUseCase';
import { DeleteMediaItemUseCase } from '../../app/use_cases/media/DeleteMediaItemUseCase';
import { CreateMediaItemDto } from './dto/media/CreateMediaItemDto';
import { UpdateMediaItemDto } from './dto/media/UpdateMediaItemDto';
import { MediaItemResponse } from '../../app/modules/MediaItemResponse';
import { MediaItem } from '../../domain/entities/MediaItem';

@ApiTags('Media Items')
@Controller('media-items')
export class MediaItemController {
	constructor(
		private readonly createMediaItemUseCase: CreateMediaItemUseCase,
		private readonly updateMediaItemUseCase: UpdateMediaItemUseCase,
		private readonly getMediaItemByIdUseCase: GetMediaItemByIdUseCase,
		private readonly listMediaItemsUseCase: ListMediaItemsUseCase,
		private readonly deleteMediaItemUseCase: DeleteMediaItemUseCase,
	) { }

	@Post()
	@ApiOperation({ summary: 'Crear un nuevo media item' })
	@ApiResponse({ status: HttpStatus.CREATED, description: 'Media item creado exitosamente', type: MediaItemResponse })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
	async create(@Body() dto: CreateMediaItemDto): Promise<MediaItemResponse> {
		const mediaItem = await this.createMediaItemUseCase.execute(dto);
		return this.toResponse(mediaItem);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar un media item' })
	@ApiParam({ name: 'id', description: 'ID del media item' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Media item actualizado exitosamente', type: MediaItemResponse })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Media item no encontrado' })
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
	@ApiResponse({ status: HttpStatus.OK, description: 'Media item encontrado', type: MediaItemResponse })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Media item no encontrado' })
	async getById(@Param('id') id: string): Promise<MediaItemResponse> {
		const mediaItem = await this.getMediaItemByIdUseCase.execute(id);
		return this.toResponse(mediaItem);
	}

	@Get()
	@ApiOperation({ summary: 'Listar todos los media items' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Lista de media items', type: [MediaItemResponse] })
	async list(): Promise<MediaItemResponse[]> {
		const mediaItems = await this.listMediaItemsUseCase.execute();
		return mediaItems.map(item => this.toResponse(item));
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Eliminar un media item' })
	@ApiParam({ name: 'id', description: 'ID del media item' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Media item eliminado exitosamente' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Media item no encontrado' })
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
