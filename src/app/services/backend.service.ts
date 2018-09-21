import { Injectable, Input } from '@angular/core';
// import { promise } from 'protractor';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  url: string = '/api/';

  constructor(private http: HttpClient) {}

  // ------------------------------------------------------------------------ //

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

  // ------------------------------------------------------------------------ //

  fetchRelationships() {
    const relationshipsUrl = this.url + 'relationships';
    return this.http.get(relationshipsUrl).toPromise();
  }

  fetchCountries() {
    const countriesUrl = this.url + 'countries';
    return this.http.get(countriesUrl).toPromise();
  }

  fetchStates() {
    const statesUrl = this.url + 'states';
    return this.http.get(statesUrl).toPromise();
  }

  // ------------------------------------------------------------------------ //

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

  // ------------------------------------------------------------------------ //

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
    const recipientIdUrl =
      this.url + `user/${userId}/recipients/${recipientId}`;

    return this.http.get(recipientIdUrl).toPromise();
  }

  editRecipientById(userId, recipientId, formData) {
    const recipientIdUrl =
      this.url + `user/${userId}/recipients/${recipientId}`;
    formData.groupId = Number(formData.groupId);

    if (formData.groupId < 1) {
      // Prevents groupId from being 0:
      formData.groupId = null;
    }

    return this.http.put(recipientIdUrl, formData).toPromise();
  }

  deleteRecipientById(userId, recipientId) {
    const recipientIdUrl =
    this.url + `user/${userId}/recipients/${recipientId}`;

    return this.http.delete(recipientIdUrl).toPromise();
  }

  // ------------------------------------------------------------------------ //

  fetchGroups(userId) {
    const groupsUrl = this.url + `user/${userId}/groups`;

    return this.http.get(groupsUrl).toPromise();
  }

  fetchGroup(userId, groupId) {
    const groupUrl = this.url + `user/${userId}/groups/${groupId}`;

    return this.http.get(groupUrl).toPromise();
  }

  fetchGroupMembers(userId, groupId) {
    const groupMembersUrl =
      this.url + `user/${userId}/groups/${groupId}/members`;

    return this.http.get(groupMembersUrl).toPromise();
  }

  fetchGroupPackage(userId, groupId) {
    const groupPackageUrl =
      this.url + `user/${userId}/groups/${groupId}/package`;

    return this.http.get(groupPackageUrl).toPromise();
  }

  // ------------------------------------------------------------------------ //

  addPackage(userId, formData) {
    const packageUrl = this.url + `user/${userId}/packages`;

    return this.http.post(packageUrl, formData).toPromise();
  }

  fetchPackageById(userId, packageId) {
    const packageIdUrl = this.url + `user/${userId}/packages/${packageId}`;

    return this.http.get(packageIdUrl).toPromise();
  }

  editPackageEncryptedFile(userId, packageId, formData) {
    const editPackageEncryptedFileUrl =
      this.url + `user/${userId}/packages/${packageId}`;

    return this.http.put(editPackageEncryptedFileUrl, formData).toPromise();
  }

  deletePackageById(userId, packageId) {
    const packageIdUrl = this.url + `user/${userId}/packages/${packageId}`;

    return this.http.delete(packageIdUrl).toPromise();
  }

  // ------------------------------------------------------------------------ //

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
