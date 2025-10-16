// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Response, Request } from 'express';
// import { randomUUID } from 'crypto';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     if (response.headersSent) {
//       return;
//     }

//     const isApiRequest = request.originalUrl.startsWith('/api');

//     if (isApiRequest) {
//       const status =
//         exception instanceof HttpException
//           ? exception.getStatus()
//           : HttpStatus.INTERNAL_SERVER_ERROR;

//       const exceptionResponse =
//         exception instanceof HttpException
//           ? (exception.getResponse() as any)
//           : 'Internal Server Error';

//       const message =
//         typeof exceptionResponse === 'string'
//           ? exceptionResponse
//           : exceptionResponse.message || 'Internal Server Error';

//       const error =
//         typeof exceptionResponse === 'string'
//           ? 'Internal Server Error'
//           : exceptionResponse.error;

//       const payload =
//         exceptionResponse.payload ||
//         (exceptionResponse.message instanceof Array
//           ? exceptionResponse.message
//           : null);

//       response.status(status).json({
//         requestId: randomUUID(),
//         success: false,
//         code: status,
//         message,
//         messageLBL: error,
//         payload,
//       });
//     }

//     let fieldErrors: { field: string; errors: string[] }[] = [];
//     let generalError: string | null = null;

//     if (exception instanceof HttpException) {
//       const res = exception.getResponse() as
//         | { message: string | string[]; error?: string }
//         | string;

//       let messages: string[] = [];

//       if (Array.isArray(res)) messages = res;
//       else if (typeof res === 'object' && 'message' in res)
//         messages = Array.isArray(res.message) ? res.message : [res.message];
//       else if (typeof res === 'string') messages = [res];

//       messages.forEach((msg) => {
//         const firstWord = msg.split(' ')[0];
//         const looksLikeField = /^[a-zA-Z_]+$/.test(firstWord);
//         if (looksLikeField && msg.includes('must')) {
//           fieldErrors.push({ field: firstWord, errors: [msg] });
//         } else {
//           generalError = msg;
//         }
//       });
//     } else {
//       generalError = 'Unexpected error occurred.';
//     }

//     //@ts-ignore
//     request.flash('error', fieldErrors);
//     //@ts-ignore
//     if (generalError) request.flash('toastError', generalError);

//     //@ts-ignore
//     request.flash('oldInput', request.body);

//     const referer = request.headers.referer || '/';
//     return response.redirect(referer);
//   }
// }

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { randomUUID } from 'crypto';

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
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const exceptionResponse =
        exception instanceof HttpException
          ? (exception.getResponse() as any)
          : 'Internal Server Error';

      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || 'Internal Server Error';

      const error =
        typeof exceptionResponse === 'string'
          ? 'Internal Server Error'
          : exceptionResponse.error;

      const payload =
        exceptionResponse.payload ||
        (exceptionResponse.message instanceof Array
          ? exceptionResponse.message
          : null);

      response.status(status).json({
        requestId: randomUUID(),
        success: false,
        code: status,
        message,
        messageLBL: error,
        payload,
      });
    } else {
      let fieldErrors: Record<string, string[]> = {};
      let generalError: string | null = null;
      let toastMessage: { message: string; type: 'success' | 'error' } | null =
        null;

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
          const parts = msg.split(' ');
          const firstWord = parts[0].toLowerCase();

          const isFieldTag = /^[a-zA-Z_]+$/.test(firstWord);

          if (isFieldTag) {
            const fieldName = firstWord;
            const actualMessage = parts.slice(1).join(' ');

            if (!fieldErrors[fieldName]) {
              fieldErrors[fieldName] = [];
            }
            fieldErrors[fieldName].push(actualMessage);
          } else {
            if (generalError) {
              generalError += '. ' + msg;
            } else {
              generalError = msg;
            }
          }
        });
      } else {
        generalError = 'Unexpected error occurred.';
      }

      if (generalError) {
        toastMessage = {
          message: generalError,
          type: 'error',
        };
      }

      request.flash('error', fieldErrors);
      request.flash('toast', toastMessage);
      request.flash('oldInput', request.body);

      const referer = request.headers.referer || '/';
      return response.redirect(referer);
    }
  }
}
