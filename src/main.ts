import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');
  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('t1 camp form api')
    .setVersion('1.0')
    .addBasicAuth()
    .addTag('users')
    .build();
  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.use(cors({
    origin: ['http://localhost:5173', 'https://admin-panel-six-sandy.vercel.app'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    credentials: true
  }));

  app.use(
    session({
      secret: 't1_camp_js',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
