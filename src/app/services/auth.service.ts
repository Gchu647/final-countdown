import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { SessionsService } from './sessions.service';

@Injectable ({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private backend: BackendService,
    private session: SessionsService
  ){};

  login(data) {
    return this.backend.login(data)
    .then(response => {
      this.session.setSession(response['username'], response['id']);

      return response;
    })
  }

  logout() {
    return this.backend.logout()
    .then(response => {
      this.session.clearSession();

      return response;
    });
  }

  fetchRecipients() {
    return this.backend.fetchRecipients()
    .then(response => {
      return response;
    });
  }
}

// get userId info from this route and add it to the obj passed in
// also need ngOnInit() to get profile information