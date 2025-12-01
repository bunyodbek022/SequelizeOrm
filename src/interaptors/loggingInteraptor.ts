import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()

export class LoggingInteraptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        console.log("Request keldi");

        return next.handle()
            .pipe(tap(() => console.log(`Request tugadi. Vaqt: ${Date.now() - now}ms`),
            ));
    }
}