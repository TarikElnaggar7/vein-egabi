import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router } from '@angular/router';

@Injectable()

export class HttpErrorInterceptor implements HttpInterceptor {
    errorMessage: string = '';

    // toastr: ToastrService;
    constructor(public toastr: ToastrService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        this.errorMessage = `Error: ${error.error.message}`;
                    } else {
                        // server-side error
                        if (error.status == 0) {
                            this.errorMessage = "Network Error"

                        }
                        else if (error.status == 401) {
                            this.errorMessage = `Unauthorized - user is already loged in`
                            this.router.navigate(["/logout"]);
                        }

                        else {
                            this.errorMessage = `Error Code: ${error.status}
                        Message: ${error.message}`;
                        }
                    }
                    // window.alert(this.errorMessage);
                    this.toastr.clear();
                    this.toastr.error(this.errorMessage, 'Error', { positionClass: 'toast-top-center' });
                    return throwError(this.errorMessage);
                })
            )
    }
}

