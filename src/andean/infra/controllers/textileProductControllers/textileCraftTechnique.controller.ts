import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/CreateTextileCraftTechniqueUseCase';
import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { CreateTextileCraftTechniqueDto } from '../dto/textileProducts/CreateTextileCraftTechniqueDto';
import { UpdateTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/UpdateTextileCraftTechniqueUseCase';
import { GetAllTextileCraftTechniquesUseCase } from 'src/andean/app/use_cases/textileProducts/GetAllTextileCraftTechniquesUseCase';
import { GetByIdTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/GetByIdTextileCraftTechniqueUseCase';
import { DeleteTextileCraftTechniqueUseCase } from 'src/andean/app/use_cases/textileProducts/DeleteTextileCraftTechniqueUseCase';

@ApiTags('Textile Craft Techniques')
@Controller('textile-products/craft-techniques')
export class TextileCraftTechniqueController {
	constructor(
		private readonly createTextileCraftTechniqueUseCase: CreateTextileCraftTechniqueUseCase,
		private readonly updateTextileCraftTechniqueUseCase: UpdateTextileCraftTechniqueUseCase,
		private readonly getAllTextileCraftTechniquesUseCase: GetAllTextileCraftTechniquesUseCase,
		private readonly getByIdTextileCraftTechniqueUseCase: GetByIdTextileCraftTechniqueUseCase,
		private readonly deleteTextileCraftTechniqueUseCase: DeleteTextileCraftTechniqueUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear nueva técnica de elaboración',
		description:
			'Crea una nueva técnica artesanal de elaboración textil (ej: Tejido a telar, Tejido a palitos, Bordado a mano, Macramé)',
	})
	@ApiResponse({
		status: 201,
		description: 'Técnica creada exitosamente',
		type: TextileCraftTechnique,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos',
	})
	async createTextileCraftTechnique(
		@Body() body: CreateTextileCraftTechniqueDto,
	): Promise<TextileCraftTechnique> {
		return this.createTextileCraftTechniqueUseCase.handle(body);
	}

	// @Put('/:id')
	// @ApiOperation({
	// 	summary: 'Actualizar técnica de elaboración',
	// 	description: 'Actualiza los datos de una técnica de elaboración existente',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la técnica',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Técnica actualizada exitosamente',
	// 	type: TextileCraftTechnique,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Técnica no encontrada',
	// })
	// async updateTextileCraftTechnique(
	// 	@Param('id') id: string,
	// 	@Body() body: CreateTextileCraftTechniqueDto,
	// ): Promise<TextileCraftTechnique> {
	// 	return this.updateTextileCraftTechniqueUseCase.handle(id, body);
	// }

	// @Get()
	// @ApiOperation({
	// 	summary: 'Listar todas las técnicas de elaboración',
	// 	description:
	// 		'Retorna todas las técnicas artesanales de elaboración textil disponibles',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Lista de técnicas',
	// 	type: [TextileCraftTechnique],
	// })
	// async getAllTextileCraftTechniques(): Promise<TextileCraftTechnique[]> {
	// 	return this.getAllTextileCraftTechniquesUseCase.handle();
	// }

	// @Get('/:id')
	// @ApiOperation({
	// 	summary: 'Obtener técnica por ID',
	// 	description: 'Retorna una técnica de elaboración específica por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la técnica',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Técnica encontrada',
	// 	type: TextileCraftTechnique,
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Técnica no encontrada',
	// })
	// async getByIdTextileCraftTechnique(
	// 	@Param('id') id: string,
	// ): Promise<TextileCraftTechnique> {
	// 	return this.getByIdTextileCraftTechniqueUseCase.handle(id);
	// }

	// @Delete('/:id')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @ApiOperation({
	// 	summary: 'Eliminar técnica de elaboración',
	// 	description: 'Elimina una técnica de elaboración por su ID',
	// })
	// @ApiParam({
	// 	name: 'id',
	// 	description: 'ID de la técnica a eliminar',
	// 	example: 'uuid-1234-5678',
	// })
	// @ApiResponse({
	// 	status: 204,
	// 	description: 'Técnica eliminada exitosamente',
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	description: 'Técnica no encontrada',
	// })
	// async deleteTextileCraftTechnique(@Param('id') id: string): Promise<void> {
	// 	return this.deleteTextileCraftTechniqueUseCase.handle(id);
	// }
}
