import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginFormData: {
    email: string;
    password: string;
  } = {
    email: '',
    password: ''
  };

  // Errors:
  emailError: string = '';
  passwordError: string = '';
  credentialsError: string = '';

  constructor(private router: Router, private auth: AuthService) {}

  login() {
    // Ensure that all inputs have been validated prior to login:
    this.validateEmail('blur');
    this.validatePassword('blur');

    const errorMessages = [this.emailError, this.passwordError];

    // Proceed with user login only if there are no input errors:
    if (errorMessages.some(errorMessage => errorMessage.length > 0)) {
      return;
    } else {
      return this.auth.login(this.loginFormData)
        .then(() => {
          this.router.navigate(['/messages']);
        })
        .catch(response => {
          const errorMessage: string = response.error.message;

          // Display error if user submits invalid email or password:
          if (
            errorMessage === 'Invalid Email' ||
            errorMessage === 'Invalid Password'
          ) {
            this.credentialsError = 'Invalid Credentials';
            this.resetInputsAndInputErrors();
            this.toggleSubmitButton();
          }
        });
    }
  }

  // ------------------------------------------------------------------------ //

  validateEmail(eventTypeStr) {
    const emailErrorMessages = ['Required', 'Enter a valid email address'];
    const email = document
      .getElementsByClassName('login-form-inner-input-email')[0]
      ['value'].trim();

    // Example of valid split email: ['user', 'gmail', 'com']
    let splitEmail;

    if (
      email.split('@')[0] &&
      email.split('@')[1] &&
      email.split('@')[1].split('.')[1]
    ) {
      // Split email into three array indices if necessay elements are present:
      splitEmail = [email.split('@')[0]].concat(email.split('@')[1].split('.'));
    } else {
      // Otherwise, allow validation to proceed against erroneous input:
      splitEmail = ['', '', ''];
    }

    const validAlphaRegex = /^[a-z]+$/i;
    const validAlphaNumericRegex = /^[a-z0-9]+$/i;

    switch (eventTypeStr) {
      case 'blur':
        // Display error if input does not satisfy the following tests:
        if (email === '') {
          this.emailError = emailErrorMessages[0];
        } else if (
          !validAlphaNumericRegex.test(splitEmail[0]) ||
          !validAlphaNumericRegex.test(splitEmail[1]) ||
          !validAlphaRegex.test(splitEmail[2])
        ) {
          this.emailError = emailErrorMessages[1];
        } else {
          this.emailError = '';
        }
        this.toggleSubmitButton();
        break;

      case 'ngModelChange':
        // Immediately removes existing error message once valid input entered:
        if (
          this.emailError &&
          validAlphaNumericRegex.test(splitEmail[0]) &&
          validAlphaNumericRegex.test(splitEmail[1]) &&
          validAlphaRegex.test(splitEmail[2])
        ) {
          this.emailError = '';
        }
        this.credentialsError = ''; // Remove error once user begins typing.
        this.toggleSubmitButton();
        break;

      default:
        break;
    }
  }

  validatePassword(eventTypeStr) {
    const errorMessage = 'Must be 8-16 characters in length';
    const password = document.getElementsByClassName(
      'login-form-inner-input-password'
    )[0]['value'];

    switch (eventTypeStr) {
      case 'blur':
        // Display error if input does not satisfy the following tests:
        if (password.length < 8 || password.length > 16) {
          this.passwordError = errorMessage;
        } else {
          this.passwordError = '';
        }
        this.toggleSubmitButton();
        break;

      case 'ngModelChange':
        // Immediately remove existing error message once valid input entered:
        if (
          this.passwordError &&
          (password.length >= 8 && password.length <= 16)
        ) {
          this.passwordError = '';
        }
        this.credentialsError = ''; // Remove error once user begins typing.
        this.toggleSubmitButton();
        break;

      default:
        break;
    }
  }

  resetInputsAndInputErrors() {
    const emailInput = document.getElementsByClassName(
      'login-form-inner-input-email'
    )[0];
    const passwordInput = document.getElementsByClassName(
      'login-form-inner-input-password'
    )[0];

    emailInput['value'] = '';
    passwordInput['value'] = '';
    this.emailError = '';
    this.passwordError = '';
  }

  toggleSubmitButton() {
    // Enable submit button only if there are no validation errors:
    const submitButton = document.getElementsByClassName('buttons-primary')[0];
    const errorMessages = [this.emailError, this.passwordError];

    // Use "fake" disabled appearance to retain button functionality (allows the
    // user to continue to interact with the submit button and be presented with
    // appropriate error messages whenever the submit button is clicked):
    if (errorMessages.some(errorMessage => errorMessage.length > 0)) {
      submitButton.classList.add('disabled');
    } else if (
      !this.loginFormData['email'] ||
      !this.loginFormData['password']
    ) {
      submitButton.classList.add('disabled');
    } else {
      submitButton.classList.remove('disabled');
    }
  }
}
