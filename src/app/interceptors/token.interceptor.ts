import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenApi } from '../models/token-api.model';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const jwtToken = this.auth.getToken();
    if (jwtToken) {
      //Here request will be modified
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${jwtToken}` },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status == 401) {
            return this.handleUnAuthorizedError(request, next);
          }
        }
        return throwError(() => new Error(err?.error.message));
      })
    );
  }

  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let tokenApiModel = new TokenApi();
    tokenApiModel.accessToken = this.auth.getToken()!;
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokenApiModel).pipe(
      switchMap((data: TokenApi) => {
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${data.accessToken}` },
        });
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.toastr.warning('Token Expired,Please Login again');
          this.router.navigate(['login']);
        });
      })
    );
  }
}
