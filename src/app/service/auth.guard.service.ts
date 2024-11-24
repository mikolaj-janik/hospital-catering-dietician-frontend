import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService); 

  if (!authService.isLoggedIn()) {
    authService.logout();
    return false;
  }
  return true;
}

export const authGuardLogin: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    authService.logout();
    return false;
  }
  return true;
}


