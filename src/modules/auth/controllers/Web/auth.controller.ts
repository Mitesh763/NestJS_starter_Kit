import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  UseGuards,
  Session,
  Res,
} from '@nestjs/common';
import { LoginDto } from '../../dto/request/login.dto';
import { AuthService } from '../../auth.service';
import { RegisterDto } from '../../dto/request/register.dto';
import { User } from '../../../user/user.entity';
import { CurrentUser } from '../../../user/decorators/current-user.decorator';
import { AuthGuard } from '../../../../guards/auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('user')
  @UseGuards(AuthGuard)
  authUser(@CurrentUser() user: User) {
    return user;
  }
}
