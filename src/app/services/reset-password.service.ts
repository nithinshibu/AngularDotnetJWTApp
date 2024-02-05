import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ResetPassword } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  constructor(private http: HttpClient) {}

  setResetPasswordLink(email: string) {
    return this.http.post<any>(
      `${environment.apiBaseURL}send-reset-email/${email}`,
      {}
    );
  }

  resetPassword(resetPasswordObj: ResetPassword) {
    return this.http.post<any>(
      `${environment.apiBaseURL}reset-password`,
      resetPasswordObj
    );
  }
}
