import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class UserSessionMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.session?.userId;

    if (userId) {
      const user = await this.usersService.findOne(userId);

      if (user) req.authUser = user;
      else if (req.session) req.session.userId = '';
    }

    next();
  }
}
