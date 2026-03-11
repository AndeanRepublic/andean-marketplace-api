import {
	Controller,
	Post,
	Body,
	HttpStatus,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiConsumes,
	ApiBody,
} from '@nestjs/swagger';
import { TryOnUseCase } from '../../app/use_cases/tryOn/TryOnUseCase';
import { TryOnDto } from './dto/tryOn/TryOnDto';
import { TryOnResponse } from '../../app/modules/tryOn/TryOnResponse';

@ApiTags('Try On')
@Controller('try-on')
export class TryOnController {
	constructor(private readonly tryOnUseCase: TryOnUseCase) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiOperation({
		summary: 'Probar una prenda virtualmente usando IDM-VTON',
		description:
			'Recibe una foto del usuario y el ID de un producto textil. La descripción de la prenda se obtiene automáticamente de baseInfo.description y la imagen del MediaItem con role PRODUCT.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			required: ['file', 'textileProductId'],
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description: 'Foto del usuario (jpeg, png o webp, máx 5MB)',
				},
				textileProductId: {
					type: 'string',
					description: 'ID del producto textil a probar virtualmente',
					example: '507f1f77bcf86cd799439011',
				},
			},
		},
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Imagen resultante del try-on en base64',
		type: TryOnResponse,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description:
			'Producto textil no encontrado o sin MediaItem con role PRODUCT',
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Archivo inválido o parámetros incorrectos',
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: 'Error al procesar la imagen con Segmind',
	})
	async tryOn(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
					new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
				],
			}),
		)
		file: Express.Multer.File,
		@Body() dto: TryOnDto,
	): Promise<TryOnResponse> {
		return this.tryOnUseCase.execute({
			humanImageFile: file,
			textileProductId: dto.textileProductId,
		});
	}
}
