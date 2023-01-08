import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const responseBody = {
      statusCode: this.getStatusCode(exception),
      message: this.getErrorMessage(exception),
      code: this.getErrorCode(exception),
      action: this.getAction(exception),
      meta: {
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  getStatusCode(exception: any) {
    return exception instanceof HttpException ? exception.getStatus() : 500;
  }

  getErrorMessage(exception: any) {
    const isHttpException = exception instanceof HttpException;
    if (!isHttpException) {
      return 'Internal Server Error';
    }

    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }

    const { message } = response as any;
    if (message && typeof message === 'string') {
      return message;
    }

    if (message && typeof message === 'object' && message.length) {
      return message[0];
    }

    return 'Internal Server Error';
  }

  getErrorCode(exception: any) {
    return this.getCustomParameter(exception, 'code', 'UNKNOWN_ERROR');
  }

  getAction(exception: any) {
    return this.getCustomParameter(
      exception,
      'action',
      "Actually, we don't know why this happened. Try again or please contact us.",
    );
  }

  getCustomParameter(exception: any, parameter: string, defaultValue: any = null) {
    const isHttpException = exception instanceof HttpException;
    if (!isHttpException) {
      return defaultValue;
    }

    const response = exception.getResponse();
    if (typeof response === 'string') {
      return defaultValue;
    }

    if (!(response as any)[parameter] || typeof (response as any)[parameter] !== 'string') {
      return defaultValue;
    }

    return (response as any)[parameter];
  }
}
