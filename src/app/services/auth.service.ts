import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApi } from '../models/token-api.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userPayLoad: any;
  constructor(private http: HttpClient, private router: Router) {
    this.userPayLoad = this.decodedToken();
  }
  signUp(userObj: any) {
    return this.http.post<any>(`${environment.apiBaseURL}register`, userObj);
  }

  login(loginObj: any) {
    return this.http.post<any>(
      `${environment.apiBaseURL}authenticate`,
      loginObj
    );
  }

  signOut() {
    //localStorage.removeItem('token');
    this.router.navigate(['login']);
    localStorage.clear();
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }
  getFullNameFromToken() {
    this.userPayLoad = this.decodedToken();
    if (this.userPayLoad) {
      return this.userPayLoad.username;
    }
  }

  getRoleFromToken() {
    this.userPayLoad = this.decodedToken();
    if (this.userPayLoad) {
      return this.userPayLoad.role;
    }
  }

  renewToken(tokenApi: TokenApi) {
    return this.http.post<any>(`${environment.apiBaseURL}refresh`, tokenApi);
  }
}
