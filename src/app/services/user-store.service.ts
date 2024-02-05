import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private fullname$ = new BehaviorSubject<string>('');
  private role$ = new BehaviorSubject<string>('');
  constructor() {}

  public getRoleFromStore() {
    return this.role$.asObservable();
  }

  public setRoleForStore(role: string) {
    this.role$.next(role);
  }

  public getFullNameFromStore() {
    return this.fullname$.asObservable();
  }

  public setFullNameForStore(fullname: string) {
    this.fullname$.next(fullname);
  }
}
