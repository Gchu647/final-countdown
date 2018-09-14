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
    // const loginUrl = this.url + 'login';
    // return this.http.post(loginUrl, data).toPromise();
    console.log('backend service login', data);
    return Promise.resolve({});
  }

  // logout() {
  //   const logoutUrl = this.url + 'logout';
  //   return this.http.get(logoutUrl).toPromise();
  // }
}