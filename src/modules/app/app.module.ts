import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../../data-source';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../../config/database.config';
import passportConfig from '../../config/passport.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ViewLocalsMiddleware } from 'src/middlewares/view-locals.middleware';
import { UserSessionMiddleware } from 'src/middlewares/current-user.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, passportConfig],
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer

      .apply(UserSessionMiddleware)
      .forRoutes('*')

      .apply(ViewLocalsMiddleware)
      .forRoutes('*');
  }
}
