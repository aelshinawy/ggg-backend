import { HttpService } from '@nestjs/axios';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from "rxjs";

export class HttpServiceInterceptor implements NestInterceptor {
  constructor(private httpService: HttpService) {}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        throw new Error("Method not implemented.");
    }
}
