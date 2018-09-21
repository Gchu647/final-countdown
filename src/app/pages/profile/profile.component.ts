import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, DoCheck {
  formData: object = {
    id: 0,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    countryId: 0,
    stateId: 0,
    city: '',
    email: '',
    phoneNumber: ''
  };

  countries: object[];
  states: object[];
  showStates: boolean = false;

  firstNameError: string = '';
  lastNameError: string = '';
  phoneError: string = '';

  constructor(
    private auth: AuthService,
    private backend: BackendService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.fetchProfile().then((response: object) => {
      this.formData = response;
    });

    this.backend.fetchCountries().then((response: object[]) => {
      this.countries = response.map(country => {
        return {
          id: country['id'],
          name: country['name']
        };
      });
    });

    this.backend.fetchStates()
      .then((response: object[]) => {
        this.states = response.map(state => {
          return {
            id: state['id'],
            name: state['name']
          };
        });
      })
      .then(() => {
        this.toggleStates(); // Ensures state dropdown menu displays on load.
      });
  }

  ngDoCheck() {
    this.toggleStates();
  }

  saveProfile() {
    this.auth
      .editProfile(this.formData)
      .then(() => {
        this.router.navigate(['/messages']);
      });
  }

  toggleStates() {
    if (this.countries) {
      const countryInput = document.getElementsByClassName(
        'profile-form-inner-input-country'
      )[0];
      const unitedStatesId = this.countries[
        this.countries.findIndex(country => country['name'] === 'United States')
      ]['id'];

      Number(countryInput['value']) === unitedStatesId
        ? (this.showStates = true)
        : (this.showStates = false);
    }
  }

  validateName(classNameStr) {
    const nameErrorMessage = 'Required';
    const name = document
      .getElementsByClassName(classNameStr)[0]
      ['value'].trim();

    // Display error if first or last name input field is empty:
    switch (classNameStr) {
      case 'profile-form-inner-input-first-name':
        if (this.checkEmptyNameField(name)) {
          this.firstNameError = nameErrorMessage;
        } else {
          this.firstNameError = '';
        }
        this.toggleSubmitButton();
        break;
      case 'profile-form-inner-input-last-name':
        if (this.checkEmptyNameField(name)) {
          this.lastNameError = nameErrorMessage;
        } else {
          this.lastNameError = '';
        }
        this.toggleSubmitButton();
        break;
      default:
        break;
    }
  }

  checkEmptyNameField(name) {
    return name.length < 1 ? true : false;
  }

  validatePhoneNumber(eventTypeStr) {
    const phoneErrorMessage = 'Enter a valid 10-digit phone number';
    const phoneNumber = document
      .getElementsByClassName('profile-form-inner-input-phone')[0]
      ['value'].trim();

    // Source: www.w3resource.com/javascript/form/phone-no-validation.php
    const validRegexNumbers: any[] = [
      /^\d{10}$/,
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
    ];

    switch (eventTypeStr) {
      case 'blur':
        // Display error if (1) user enters text into phone number input, and
        // (2) the text input does not match any regular expressions above:
        if (phoneNumber === '') {
          this.phoneError = '';
        } else {
          if (!validRegexNumbers.some(regex => regex.test(phoneNumber))) {
            this.phoneError = phoneErrorMessage;
          }
        }
        this.toggleSubmitButton();
        break;
      case 'ngModelChange':
        // Immediately removes existing error message once valid input entered:
        if (
          this.phoneError &&
          // An empty input is also deemed valid (as input is not required):
          (validRegexNumbers.some(regex => regex.test(phoneNumber)) ||
            phoneNumber === '')
        ) {
          this.phoneError = '';
        }
        this.toggleSubmitButton();
        break;
      default:
        break;
    }
  }

  toggleSubmitButton() {
    // Enable submit button only if there are no validation errors:
    const submitButton = document.getElementsByClassName('buttons-primary')[0];
    const errorMessages = [
      this.firstNameError,
      this.lastNameError,
      this.phoneError
    ];

    if (errorMessages.some(errorMessage => errorMessage.length > 0)) {
      submitButton.setAttribute('disabled', '');
    } else {
      submitButton.removeAttribute('disabled');
    }
  }
}
