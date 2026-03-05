import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 4000);

    // ─── Global Prefix ─────────────────────────────────────────────────────────
    app.setGlobalPrefix('api');

    // ─── API Versioning ─────────────────────────────────────────────────────────
    app.enableVersioning({ type: VersioningType.URI });

    // ─── Global Validation Pipe ─────────────────────────────────────────────────
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // ─── CORS ───────────────────────────────────────────────────────────────────
    app.enableCors({
        origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
        credentials: true,
    });

    // ─── Swagger / OpenAPI ──────────────────────────────────────────────────────
    if (configService.get<string>('NODE_ENV') !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('Hospital Management System API')
            .setDescription('HMS REST API documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);
    }

    await app.listen(port);
    console.log(`🏥 HMS Backend running on: http://localhost:${port}/api`);
    console.log(`📄 Swagger docs:            http://localhost:${port}/api/docs`);
}

bootstrap();
