import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof MongooseError.ValidationError) {
      response.status(400).json({
        statusCode: 400,
        message: 'Validation error',
        errors: exception.errors,
      });
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      response.status(status).json({
        statusCode: status,
        message,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: exception instanceof Error ? exception.message : exception,
      });
    }
  }
}
