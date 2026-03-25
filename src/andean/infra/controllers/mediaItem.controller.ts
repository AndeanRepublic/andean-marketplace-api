import {
	Controller,
	Get,
	Post,
	Delete,
	Body,
	Param,
	HttpCode,
	HttpStatus,
	UseInterceptors,
	UploadedFile,
	UseGuards,
	BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { RolesGuard } from '../core/roles.guard';
import { Roles } from '../core/roles.decorator';
import { AccountRole } from '../../domain/enums/AccountRole';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiConsumes,
	ApiBody,
} from '@nestjs/swagger';
import { Public } from '../core/public.decorator';
import { UploadMediaItemUseCase } from '../../app/use_cases/media/UploadMediaItemUseCase';
import { UpdateMediaItemUseCase } from '../../app/use_cases/media/UpdateMediaItemUseCase';
import { GetMediaItemByIdUseCase } from '../../app/use_cases/media/GetMediaItemByIdUseCase';
import { ListMediaItemsUseCase } from '../../app/use_cases/media/ListMediaItemsUseCase';
import { DeleteMediaItemUseCase } from '../../app/use_cases/media/DeleteMediaItemUseCase';
import { UploadMediaItemDto } from './dto/media/UploadMediaItemDto';
import { UpdateMediaItemDto } from './dto/media/UpdateMediaItemDto';
import { MediaItemResponse } from '../../app/models/shared/MediaItemResponse';
import { MediaItem } from '../../domain/entities/MediaItem';
import { MediaItemType } from '../../domain/enums/MediaItemType';
import { MediaItemRole } from '../../domain/enums/MediaItemRole';

@ApiTags('Media Items')
@Controller('media-items')
export class MediaItemController {
	private readonly storageBaseUrl: string;
	private readonly maxFileSizeBytes: number;

	constructor(
		private readonly uploadMediaItemUseCase: UploadMediaItemUseCase,
		private readonly updateMediaItemUseCase: UpdateMediaItemUseCase,
		private readonly getMediaItemByIdUseCase: GetMediaItemByIdUseCase,
		private readonly listMediaItemsUseCase: ListMediaItemsUseCase,
		private readonly deleteMediaItemUseCase: DeleteMediaItemUseCase,
		private readonly configService: ConfigService,
	) {
		this.storageBaseUrl = this.configService.get<string>(
			'STORAGE_BASE_URL',
			'',
		);
		const maxSizeMB = parseInt(
			this.configService.get<string>('UPLOAD_MAX_SIZE_MB', '5'),
			10,
		);
		this.maxFileSizeBytes = maxSizeMB * 1024 * 1024;
	}

	@UseGuards(JwtAuthGuard)
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
					enum: Object.values(MediaItemType),
					description: 'Tipo de media item',
					example: 'img',
				},
				name: {
					type: 'string',
					description: 'Nombre del archivo',
					example: 'quinoa-roja.png',
				},
				role: {
					type: 'string',
					enum: Object.values(MediaItemRole),
					description: 'Rol del media item',
					example: 'principal',
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
		@UploadedFile() file: Express.Multer.File,
		@Body() dto: UploadMediaItemDto,
	): Promise<MediaItemResponse> {
		if (!file) {
			throw new BadRequestException('No file was provided');
		}

		const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
		if (!allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException(
				`File type not allowed. Accepted types: ${allowedMimeTypes.join(', ')}`,
			);
		}

		if (file.size > this.maxFileSizeBytes) {
			const maxSizeMB = this.maxFileSizeBytes / (1024 * 1024);
			throw new BadRequestException(
				`File exceeds the maximum allowed size of ${maxSizeMB}MB`,
			);
		}

		const mediaItem = await this.uploadMediaItemUseCase.execute({
			file,
			type: dto.type,
			name: dto.name,
			role: dto.role,
		});
		return this.toResponse(mediaItem);
	}

	// @Put(':id')
	// @ApiOperation({ summary: 'Actualizar un media item' })
	// @ApiParam({ name: 'id', description: 'ID del media item' })
	// @ApiResponse({
	// 	status: HttpStatus.OK,
	// 	description: 'Media item actualizado exitosamente',
	// 	type: MediaItemResponse,
	// })
	// @ApiResponse({
	// 	status: HttpStatus.NOT_FOUND,
	// 	description: 'Media item no encontrado',
	// })
	// async update(
	// 	@Param('id') id: string,
	// 	@Body() dto: UpdateMediaItemDto,
	// ): Promise<MediaItemResponse> {
	// 	const mediaItem = await this.updateMediaItemUseCase.execute(id, dto);
	// 	return this.toResponse(mediaItem);
	// }

	@Public()
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

	// @Get()
	// @ApiOperation({ summary: 'Listar todos los media items' })
	// @ApiResponse({
	// 	status: HttpStatus.OK,
	// 	description: 'Lista de media items',
	// 	type: [MediaItemResponse],
	// })
	// async list(): Promise<MediaItemResponse[]> {
	// 	const mediaItems = await this.listMediaItemsUseCase.execute();
	// 	return mediaItems.map((item) => this.toResponse(item));
	// }

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Eliminar un media item' })
	@ApiParam({ name: 'id', description: 'ID del media item' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Media item eliminado exitosamente',
		schema: {
			type: 'object',
			properties: {
				message: {
					type: 'string',
					example: 'Media item eliminado exitosamente',
				},
			},
		},
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Media item no encontrado',
	})
	async delete(@Param('id') id: string): Promise<{ message: string }> {
		await this.deleteMediaItemUseCase.execute(id);
		return { message: 'Media item eliminado exitosamente' };
	}

	private toResponse(mediaItem: MediaItem): MediaItemResponse {
		return {
			id: mediaItem.id,
			type: mediaItem.type,
			name: mediaItem.name,
			url: `${this.storageBaseUrl}/${mediaItem.key}`, // Construir URL dinámicamente
			role: mediaItem.role,
			createdAt: mediaItem.createdAt!,
			updatedAt: mediaItem.updatedAt!,
		};
	}
}
