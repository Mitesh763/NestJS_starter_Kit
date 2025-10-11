import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ViewLocalsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.locals.message = req.flash ? req.flash('message') : '';
    res.locals.error = req.flash ? req.flash('error') : [];
    res.locals.toastError = req.flash ? req.flash('toastError') : [];

    res.locals.user = req.user || null;

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
