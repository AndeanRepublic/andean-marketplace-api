import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const port = configService.get<number>('PORT', 3000);

	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api/v1/andean');
	app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

	// Swagger Configuration
	const config = new DocumentBuilder()
		.setTitle('Andean Marketplace API')
		.setDescription('API para el marketplace de productos andinos que conecta comunidades con compradores')
		.setVersion('1.0')
		.addTag('auth', 'Autenticación y gestión de sesiones')
		.addTag('users', 'Gestión de usuarios y perfiles')
		.addTag('admin', 'Administración de usuarios y contenido')
		.addTag('products', 'Gestión de productos del marketplace')
		.addTag('shops', 'Gestión de tiendas de vendedores')
		.addTag('cart', 'Carrito de compras')
		.addTag('orders', 'Gestión de órdenes y pedidos')
		.addTag('bank-accounts', 'Cuentas bancarias de vendedores')
		.addTag('uploads', 'Carga de archivos e imágenes')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Ingresa tu token JWT',
				in: 'header',
			},
			'JWT-auth', // Este es el nombre que usarás en @ApiBearerAuth()
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document, {
		customSiteTitle: 'Andean Marketplace API Docs',
		customfavIcon: 'https://nestjs.com/img/logo-small.svg',
		customCss: '.swagger-ui .topbar { display: none }',
	});

	console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);

	await app.listen(port);
}
bootstrap();
