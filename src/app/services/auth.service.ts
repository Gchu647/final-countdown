import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { SessionsService } from './sessions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: {
    loggedIn: boolean;
    email: string;
    userId: number;
  };

  constructor(
    private backend: BackendService,
    private session: SessionsService
  ) {
    this.user = this.session.getSession();
  }

  login(data) {
    return this.backend.login(data).then(response => {
      this.session.setSession(response['email'], response['id']);

      return response;
    });
  }

  logout() {
    return this.backend.logout().then(response => {
      this.session.clearSession();

      return response;
    });
  }

  fetchProfile() {
    const userId = this.user.userId;

    return this.backend.fetchProfile(userId).then(response => {
      return response;
    });
  }

  editProfile(formData) {
    const userId = this.user.userId;

    return this.backend.editProfile(userId, formData).then(response => {
      return response;
    });
  }

  fetchRecipients() {
    const userId = this.user.userId;

    return this.backend.fetchRecipients(userId).then(response => {
      return response;
    });
  }

  addRecipient(formData) {
    const userId = this.user.userId;

    return this.backend.addRecipient(userId, formData).then(response => {
      return response;
    });
  }

  fetchRecpientById(recipientId) {
    const userId = this.user.userId;

    return this.backend.fetchRecipientById(userId, recipientId)
      .then(response => {
        return response;
      });
  }

  addPackage(formData) {
    const userId = this.user.userId;

    return this.backend.addPackage(userId, formData).then(response => {
      return response;
    });
  }

  editRecipientById(recipientId, formData) {
    const userId = this.user.userId;

    return this.backend.editRecipientById(userId, recipientId, formData)
      .then(response => {
        return response;
      });
  }
}
