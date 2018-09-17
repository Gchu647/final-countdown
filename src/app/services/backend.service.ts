import { Injectable, Input } from '@angular/core';
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

    const input = {
      f_name: formData.firstName ? formData.firstName.trim() : null,
      l_name: formData.lastName ? formData.lastName.trim() : null,
      dob: formData.dateOfBirth ? formData.dateOfBirth.trim() : null,
      country: formData.countryId,
      state: formData.stateId,
      city: formData.city ? formData.city.trim() : null,
      phone_num: formData.phoneNumber ? formData.trim() : null
    };
    
    console.log('backend service edit smoke test!');
    return this.http.put(profileUrl, input).toPromise();
  }

  fetchRecipients(userId) {
    const recipientsUrl = this.url + `user/${userId}/recipients`;
    return this.http.get(recipientsUrl).toPromise();
  }
}