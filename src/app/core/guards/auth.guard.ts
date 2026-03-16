import { inject } from "@angular/core";
import { Authservice } from "../services/auth.service";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = () => {
  const authService = inject(Authservice);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};