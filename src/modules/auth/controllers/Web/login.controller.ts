import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../../auth.service';
import { LoginDto } from '../../dto/request/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller()
export class LoginController {
  constructor(private authService: AuthService) {}

  @Get('login')
  loadLoginView(@Session() session, @Res() res: Response) {
    if (session.userId) {
      return res.redirect('/');
    }
    return res.render('auth/login', {
      title: 'Login',
      page_title: 'Login',
      folder: 'Authentication',
      layout: 'layouts/layout-without-nav',
    });
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Session() session: Record<string, any>,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (session.userId) return res.redirect('/');

    const { email, password } = body;

    const user = await this.authService.validateUser(email, password);
    console.log('user: ', user);
    if (user) {
      session.userId = user.id;

      req.flash('message', 'Login successfully!');
      return res.redirect('/');
    }

    req.flash('error', ['Invalid Credentials!']);
    return res.redirect('login');
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Session() session, @Res() res: Response, @Req() req: Request) {
    session.userId = null;

    req.flash('message', 'Logout successfully!');
    return res.redirect('login');
  }
}
