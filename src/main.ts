import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Login Backend API')
    .setDescription(
      'API de autenticação e gerenciamento de usuários com validação de CPF',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Users', 'Endpoints para gerenciamento de usuários')
    .addTag('Auth', 'Endpoints de autenticação')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
