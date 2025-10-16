import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

import * as methodOverride from 'method-override';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as flash from 'connect-flash';
import * as i18n from 'i18n-express';
import { log } from './utils/logger';
import { Logger } from 'winston';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CustomValidationPipe } from './common/pipes/validation.pipe';

const fileUpload = require('express-fileupload');
const expressLayouts = require('express-ejs-layouts');

declare global {
  var log: Logger;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(methodOverride('_method'));

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  // Set up view engine
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(cookieParser());
  app.set('layout', 'layouts/layout');
  app.use(expressLayouts);
  app.use(
    session({
      secret: 'nodedemo',
      resave: false,
      saveUninitialized: true,
    }),
  );

  (global as any).log = log;
  app.use(flash());

  app.use(fileUpload());

  app.use(
    i18n({
      translationsPath: join(__dirname, '..', 'i18n'),
      siteLangs: ['ar', 'ch', 'en', 'fr', 'ru', 'it', 'gr', 'sp'],
      textsVarName: 'translation',
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new CustomValidationPipe());

  await app.listen(process.env.PORT ?? 9000);
  console.log('app is running on port: ', process.env.PORT ?? 9000);
}

void bootstrap();
