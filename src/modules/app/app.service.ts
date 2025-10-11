import { Injectable, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import databaseConfig from '../../config/database.config';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
  }
}
