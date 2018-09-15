import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable ({
  providedIn: 'root'
})
export class BackendService {
  url:
  string='http://localhost:4200/api/';

  constructor(private http: HttpClient) {

  }

  login(data) { // data has to be username and password
    const loginUrl = this.url + 'login';
    const input = {
      username: data.email,
      password: data.password
    }

    return this.http.post(loginUrl, input).toPromise();
  }

  logout() {
    const logoutUrl = this.url + 'logout';
    return this.http.get(logoutUrl).toPromise();
  }

  register(data) {
    const registerUrl = this.url + 'register';
    const input = {
      // in progress
    }
    return Promise.resolve({});
  }
}