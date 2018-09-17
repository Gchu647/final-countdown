// Prevent logged-in users from accessing login/registration/unauth-home pages:
import { SessionsService } from './sessions.service';
import { Injectable } from '@angular/core';

import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuardService implements CanActivate {
  constructor(private sessionsService: SessionsService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.sessionsService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['messages']);
  }
}