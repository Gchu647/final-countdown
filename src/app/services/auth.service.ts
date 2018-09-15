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
    .then((response) => {
      console.log('auth got response from server login: ', response);
      return this.session.setSession(response['username'], response['id']); // set session information
    })
  }

  // logout() {
  //   return this.backend.logout()
  //   .then(() => {
  //     return this.session.clearSession();
  //   })
  // }
}