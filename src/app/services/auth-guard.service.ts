import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { SessionsService } from './sessions.service';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  user: object;

  constructor(
    private session: SessionsService,
    private backend: BackendService,
    private router: Router
  ) {
    this.user = this.session.getSession();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Proceed with authorization checks only if user is logged in:
    if (this.session.isLoggedIn()) {
      // Guard against viewing the personal messages of other users:
      if (state.url.includes('personal') && route.params.id) {
        const recipientId = Number(route.params.id);

        return this.backend.fetchRecipients(this.user['userId'])
          .then((recipients: object[]) => {
            return this.checkOwnership(recipients, recipientId);
          })
          .then(userIsRecipientOwner => {
            return this.handleOwnershipCheck(userIsRecipientOwner);
          });
      }

      // Guard against viewing the group messages of other users:
      else if (state.url.includes('group') && route.params.id) {
        const groupId = Number(route.params.id);

        return this.backend.fetchGroups(this.user['userId'])
          .then((groups: object[]) => {
            return this.checkOwnership(groups, groupId);
          })
          .then(userIsGroupOwner => {
            return this.handleOwnershipCheck(userIsGroupOwner);
          });
      }

      // Otherwise, allow logged-in user to proceed to all other paths:
      else {
        return true;
      }
    }

    // Otherwise, redirect unauthenticated user to home page:
    else {
      this.router.navigate(['']);
    }
  }

  checkOwnership(response, id) {
    if (response) {
      return response.some(recipient => {
        return Number(recipient['id']) === id;
      });
    }
    return false;
  }

  handleOwnershipCheck(response) {
    if (response) {
      return true;
    } else {
      // Redirect to "auth-home-page" if user tries to view another user's data:
      this.router.navigate(['messages']);
    }
  }
}
