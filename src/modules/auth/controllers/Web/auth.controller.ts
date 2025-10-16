import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  UseGuards,
  Session,
  Res,
  Req,
} from '@nestjs/common';
import { LoginDto } from '../../dto/request/login.dto';
import { AuthService } from '../../auth.service';
import { RegisterDto } from '../../dto/request/register.dto';
import { User } from '../../../user/user.entity';
import { CurrentUser } from '../../../user/decorators/current-user.decorator';
import { AuthGuard } from '../../../../guards/auth.guard';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/modules/user/dto/response/user.dto';

@Controller()
export class AuthController {
  constructor() {}

  @Get('profile')
  @UseGuards(AuthGuard)
  authUser(@Res() res: Response, @Req() req: Request) {
    return res.render('user/show', {
      title: 'User Detail',
      page_title: 'User Detail',
      folder: 'User',
      user: plainToInstance(UserDto, req.authUser),
    });
  }
}
