import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { promise } from 'protractor';

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
      email: data.email,
      password: data.password,
      fName: data.firstName,
      lName: data.lastName
    }
    
    return this.http.post(registerUrl, input).toPromise();
  }

  fetchRelationships() {
    const relationshipsUrl = this.url + 'relationships';
    return this.http.get(relationshipsUrl).toPromise();
  }

  fetchProfile(userId) {
    const profileUrl = this.url + `user/${userId}`;
    return this.http.get(profileUrl).toPromise();
  }

  editProfile(userId, formData) {
    const profileUrl = this.url + `user/${userId}`;
    formData.countryId = Number(formData.countryId);
    formData.stateId = Number(formData.stateId);

    if(formData.countryId < 1) { // prevents countryId from being 0
      formData.countryId = null;
    }

    if(formData.stateId < 1) { // prevents stateId from being 0
      formData.stateId = null;
    }
    
    return this.http.put(profileUrl, formData).toPromise();
  }

  fetchRecipients(userId) {
    const recipientsUrl = this.url + `user/${userId}/recipients`;

    return this.http.get(recipientsUrl).toPromise();
  }

  addRecipient(userId) {
    const recipientsUrl = this.url + `user/${userId}/recipients`;

    return Promise.resolve({});
  }

  fetchRecipientById(userId, recipientId) {
    const recipientIdUrl = this.url + `user/${userId}/recipients/${recipientId}`;

    return this.http.get(recipientIdUrl).toPromise();
  }

  editRecipientById(userId, recipientId, formData) {
    const recipientIdUrl = this.url + `user/${userId}/recipients/${recipientId}`;
 
    return this.http.put(recipientIdUrl, formData).toPromise();;
  }
}