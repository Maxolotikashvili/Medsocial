import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { USER_ROLES } from "../configs/user.config";

export const patientGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.user();

  if (user.role !== USER_ROLES.PATIENT) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};