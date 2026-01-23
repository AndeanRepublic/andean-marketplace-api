import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('files')
export class UploadController {
	@Post('/upload')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
			}),
		}),
	)
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file);
		return {
			message: 'Uploaded image',
		};
	}
}
