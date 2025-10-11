import {
  NestInterceptor,
  UseInterceptors,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

// for class type validation
interface ClassConstructor<T = any> {
  new (...args: any[]): T;
}

// custom decorator
export function Serialize<T>(dto?: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto?: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    request.requestId = randomUUID();

    return next.handle().pipe(
      map(
        (data: {
          message?: string;
          messageLBL?: string;
          payload?: any;
          statusCode?: number;
        }) => {
          let defaultMessage: string = 'Operation successful';
          let defaultMessageLBL: string = 'SUCCESS';

          switch (request.method) {
            case 'GET':
              defaultMessage = 'Data fetched successfully';
              defaultMessageLBL = 'FETCH_SUCCESS';
              break;
            case 'POST':
              defaultMessage = 'Created successfully';
              defaultMessageLBL = 'CREATE_SUCCESS';
              break;
            case 'PUT':
            case 'PATCH':
              defaultMessage = 'Updated successfully';
              defaultMessageLBL = 'UPDATE_SUCCESS';
              break;
            case 'DELETE':
              defaultMessage = 'Deleted successfully';
              defaultMessageLBL = 'DELETE_SUCCESS';
              break;
          }
          
          return {
            requestId: request.requestId || randomUUID(),
            success: true,
            code: response.statusCode,
            message: data.message || defaultMessage,
            messageLBL: data.messageLBL || defaultMessageLBL,
            payload: plainToInstance(
              this.dto as ClassConstructor<T>,
              data?.payload ?? data,
              this.dto ? { excludeExtraneousValues: true } : {},
            ),
          };
        },
      ),
    );
  }
}
