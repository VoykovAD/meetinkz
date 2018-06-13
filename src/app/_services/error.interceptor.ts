import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).catch(error => {
      if (error instanceof HttpErrorResponse) {
        console.log('Error from server: ', error);
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
          return Observable.throw(applicationError);
        }

        const serverError = error.error;
        return Observable.throw(serverError || 'Server Error');
        // let modelStateErrors = '';
        // if (serverError && typeof serverError === 'object') {
        //   for (const key in serverError) {
        //     if (serverError[key]) {
        //       modelStateErrors += serverError[key] + "\n";
        //     }
        //   }
        // }

        // console.log('modelStateErrors: ' + modelStateErrors);
        // console.log('serverError: ' + serverError);
        // return Observable.throw(modelStateErrors || serverError || 'Server Error');
      }
    });
  }
}


export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
