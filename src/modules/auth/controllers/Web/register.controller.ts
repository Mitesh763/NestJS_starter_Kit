import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../../auth.service';
import { RegisterDto } from '../../dto/request/register.dto';

@Injectable()
@Controller('register')
export class RegisterController {
  constructor(private authService: AuthService) {}

  @Get()
  loadRegisterView(@Res() res: Response) {
    return res.render('auth/register', {
      title: 'Register',
      page_title: 'Register',
      folder: 'Authentication',
      layout: 'layouts/layout-without-nav',
    });
  }

  @Post()
  async register(
    @Body() body: RegisterDto,
    @Session() session: Record<string, any>,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (session.userId) return res.redirect('/');

    const user = await this.authService.register(body);

    if (user) {
      session.userId = user.id;

      req.flash('toast', {
        message: 'Registration successfully!',
        type: 'success',
      });
      return res.redirect('/');
    }

    req.flash('error', ['Registration failed, due to invalid data']);
    req.flash('oldInput', req.body);
    return res.redirect('register');
  }
}
