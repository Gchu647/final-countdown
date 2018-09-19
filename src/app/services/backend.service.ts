import { Injectable, Input } from '@angular/core';
// import { promise } from 'protractor';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  url: string = 'http://localhost:4200/api/';

  constructor(private http: HttpClient) {}

  login(data) {
    // Data object properties must be named "username" and "password":
    const loginUrl = this.url + 'login';
    const input = {
      username: data.email,
      password: data.password
    };

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
    };

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

    if (formData.countryId < 1) {
      // Prevents countryId from being 0:
      formData.countryId = null;
    }

    if (formData.stateId < 1) {
      // Prevents stateId from being 0:
      formData.stateId = null;
    }
    
    return this.http.put(profileUrl, formData).toPromise();
  }

  fetchRecipients(userId) {
    const recipientsUrl = this.url + `user/${userId}/recipients`;

    return this.http.get(recipientsUrl).toPromise();
  }

  addRecipient(userId, formData) {
    const recipientsUrl = this.url + `user/${userId}/recipients`;
    formData.groupId = Number(formData.groupId);

    if (formData.groupId < 1) {
      // Prevents groupId from being 0:
      formData.groupId = null;
    }

    return this.http.post(recipientsUrl, formData).toPromise();
  }

  fetchRecipientById(userId, recipientId) {
    const recipientIdUrl = this.url + `user/${userId}/recipients/${recipientId}`;

    return this.http.get(recipientIdUrl).toPromise();
  }

  editRecipientById(userId, recipientId, formData) {
    const recipientIdUrl = this.url + `user/${userId}/recipients/${recipientId}`;
    formData.groupId = Number(formData.groupId);

    if (formData.groupId < 1) {
      // Prevents groupId from being 0:
      formData.groupId = null;
    }
 
    return this.http.put(recipientIdUrl, formData).toPromise();;
  }

  fetchTrigger(userId) {
    const triggerUrl = this.url + `user/${userId}/trigger`;
    const params = new HttpParams().set('origin', 'frontEnd');

    return this.http.get(triggerUrl, { params }).toPromise();
  }

  activateTrigger(userId, countdownDays) {
    const triggerUrl = this.url + `user/${userId}/trigger`;
    const params = new HttpParams()
      .set('id', userId)
      .set('countdownDays', countdownDays);

    return this.http.post(triggerUrl, null, { params }).toPromise();
  }

  deactivateTrigger(userId, manualDeactivation) {
    const triggerUrl = this.url + `user/${userId}/trigger`;
    // manualDeactivation accepts a string rather than a boolean because the
    // boolean value will be converted to a string when set in HttpParams():
    const params = new HttpParams()
      .set('origin', 'frontEnd')
      .set('manualDeactivation', manualDeactivation);

    return this.http.delete(triggerUrl, { params }).toPromise();
  }

  acknowledgeNotification(userId) {
    const triggerUrl = this.url + `user/${userId}/trigger/acknowledge`;

    return this.http.put(triggerUrl, null).toPromise();
  }
}
