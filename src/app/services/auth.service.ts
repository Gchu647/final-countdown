import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { SessionsService } from './sessions.service';

@Injectable ({
  providedIn: 'root'
})
export class AuthService {

  user: {
    loggedIn: boolean,
    email: string,
    userId: number,
  };

  constructor(
    private backend: BackendService,
    private session: SessionsService
  ){
    this.user = this.session.getSession();
  };

  login(data) {
    return this.backend.login(data)
    .then(response => {
      this.session.setSession(response['email'], response['id']);

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

  fetchProfile() {
    const userId = this.user.userId;

    return this.backend.fetchProfile(userId)
    .then(response => {
      return response;
    });
  }

  editProfile(data) {
    console.log('auth.service: ', data);
    const userId = this.user.userId;

    return this.backend.editProfile(userId)
    .then(response => {
      return response;
    });
  }

  fetchRecipients() {
    console.log('auth.service: ', this.user);
    const userId = this.user.userId;

    return this.backend.fetchRecipients(userId)
    .then(response => {
      return response;
    });
  }
}

// get userId info from this route and add it to the obj passed in
// also need ngOnInit() to get profile information