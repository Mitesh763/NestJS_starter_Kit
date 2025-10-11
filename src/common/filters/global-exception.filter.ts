import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (response.headersSent) {
      return;
    }

    const isApiRequest = request.originalUrl.startsWith('/api');

    if (isApiRequest) {
      let status = 500;
      let message = 'Internal server error';

      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const res = exception.getResponse() as
          | { message: string | string[] }
          | string;

        if (typeof res === 'string') message = res;
        else if (Array.isArray(res['message']))
          message = res['message'].join(', ');
        else if (typeof res['message'] === 'string') message = res['message'];
      }

      return response.status(status).json({
        success: false,
        message,
      });
    }

    let fieldErrors: { field: string; errors: string[] }[] = [];
    let generalError: string | null = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as
        | { message: string | string[]; error?: string }
        | string;

      let messages: string[] = [];

      if (Array.isArray(res)) messages = res;
      else if (typeof res === 'object' && 'message' in res)
        messages = Array.isArray(res.message) ? res.message : [res.message];
      else if (typeof res === 'string') messages = [res];

      messages.forEach((msg) => {
        const firstWord = msg.split(' ')[0];
        const looksLikeField = /^[a-zA-Z_]+$/.test(firstWord);
        if (looksLikeField && msg.includes('must')) {
          fieldErrors.push({ field: firstWord, errors: [msg] });
        } else {
          generalError = msg;
        }
      });
    } else {
      generalError = 'Unexpected error occurred.';
    }

    //@ts-ignore
    request.flash('error', fieldErrors);
    //@ts-ignore
    if (generalError) request.flash('toastError', generalError);

    //@ts-ignore
    request.flash('oldInput', request.body);

    const referer = request.headers.referer || '/';
    return response.redirect(referer);
  }
}
