import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { randomUUID } from 'crypto';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const requestId = randomUUID();

        const payload = validationErrors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        return new BadRequestException({
          requestId,
          success: false,
          code: new BadRequestException().getStatus(),
          message: payload[0]?.errors[0] || 'Validation failed',
          messageLBL: 'Bad Request',
          payload: payload,
        });
      },
    });
  }
}
