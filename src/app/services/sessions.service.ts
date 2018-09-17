import { Injectable } from '@angular/core';

@Injectable ({
  providedIn: 'root'
})
export class SessionsService {
  user: {
    loggedIn: boolean,
    email: string,
    userId: number,
  } = {
    loggedIn: false,
    email: '',
    userId: null,
  }

  constructor() {
    let userString = window.localStorage.getItem('user');

    try {
      if (userString) { this.user = JSON.parse(userString); }
      else { console.log('user was not found'); }
    }
    catch(err) {
      console.log('could not parse user');
    }
  }

  getSession() {
    return this.user;
  }

  setSession(email, userId) {
    this.user.email = email;
    this.user.loggedIn = true;
    this.user.userId = parseInt(userId);

    let userString = JSON.stringify(this.user);
    window.localStorage.setItem('user', userString);
  }

  clearSession() {
    this.user.loggedIn = false;
    this.user.email = '';
    this.user.userId = null;
    window.localStorage.removeItem('user');
  }

  isLoggedIn() {
    return this.user.loggedIn;
  }
}