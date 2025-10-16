import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ViewLocalsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.locals.toast = req.flash ? req.flash('toast') : {};

    const errorFlash = req.flash ? req.flash('error') : [];
    res.locals.error = errorFlash.length > 0 ? errorFlash[0] : {};

    const oldInputFlash = req.flash ? req.flash('oldInput') : [];
    res.locals.oldInput = oldInputFlash.length > 0 ? oldInputFlash[0] : {};

    res.locals.authUser = req.authUser || null;

    next();
  }
}

/**
 *
 * const toast = {
 *    message: 'login successfully',
 *    type: 'success' || 'error'
 * }
 *
 *
 * const error = {
 *    email : ['email is required','']
 * }
 *
 *
 * const oldInput = {
 *    email : 'value'
 * }
 *
 */
