import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const USER_SPECIFIC_FIELDS = {
  username: (value: string) => value.replace(/./g, '*'),
  email: (value: string) => value.replace(/./g, '*'),
} as Record<string, (value: string) => string>;

@Injectable()
export class AnonymizerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    return next.handle().pipe(
      map((data) => {
        return this.anonymize(data, user);
      }),
    );
  }

  private anonymize(data: any, user: any): any {
    if (!data || typeof data !== 'object') return data;
    if (data instanceof Array) {
      return data.map((item) => this.anonymize(item, user));
    }

    if ('isAnonymous' in data && !data.isAnonymous) {
      return data;
    }

    const result = { ...data };

    Object.keys(result).forEach((key) => {
      if (USER_SPECIFIC_FIELDS[key]) {
        result[key] = USER_SPECIFIC_FIELDS[key](result[key]);
      } else if (typeof result[key] === 'object') {
        result[key] = this.anonymize(result[key], user);
      }
    });

    return result;
  }
}
