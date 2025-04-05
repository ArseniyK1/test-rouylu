import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch()
export class CommonResponseFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    let errorMessage = 'Возникла непредвиденная ошибка';

    if (Array.isArray(exception) && exception[0] instanceof ValidationError) {
      const messages = exception
        .flatMap((err: ValidationError) => Object.values(err.constraints || {}))
        .join('; ');
      errorMessage = `Ошибка валидации: ${messages}`;
    } else if (exception instanceof Error && 'getStatus' in exception) {
      const httpException = exception as {
        message: any;
        getStatus: () => number;
        response?: any;
      };
      status = httpException.getStatus();

      const message = httpException.response?.message || httpException.message;
      errorMessage = Array.isArray(message) ? message.join('; ') : message;
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      success: false,
      result: {
        error: errorMessage,
      },
    });
  }
}
