import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  if (!auth.isLoggedIn()) {
    toastr.error('Please Login First');
    router.navigate(['login']);
    return false;
  }
  return true;
};
