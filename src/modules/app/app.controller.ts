import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('health-check')
  healthCheck(@Res() response: Response) {
    log.info('Health check endpoint called');
    return response.status(200);
  }

  @Get()
  @UseGuards(AuthGuard)
  getHello(@Res() response: Response) {
    return response.render('index', {
      title: 'Home',
      page_title: 'Home',
      folder: 'General',
    });
  }
}
