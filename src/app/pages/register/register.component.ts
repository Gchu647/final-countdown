import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerFormData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirm: string;
  } = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirm: ''
  };

  // Errors:
  emailError: string = '';
  firstNameError: string = '';
  lastNameError: string = '';
  passwordError: string = '';
  passwordConfirmError: string = '';

  constructor(private router: Router, private backend: BackendService) {}

  register() {
    // Ensure that all inputs have been validated prior to registration:
    this.validateEmail('blur');
    this.validateInputLength('register-form-inner-input-first-name');
    this.validateInputLength('register-form-inner-input-last-name');
    this.validatePassword('blur');
    this.validatePasswordConfirm('blur');

    const errorMessages = [
      this.firstNameError,
      this.lastNameError,
      this.emailError,
      this.passwordError,
      this.passwordConfirmError
    ];

    // Proceed with user registration only if there are no input errors:
    if (errorMessages.some(errorMessage => errorMessage.length > 0)) {
      return;
    } else {
      return this.backend
        .register(this.registerFormData)
        .then(response => {
          console.log('Response @register_component: ', response);
        })
        .then(() => this.router.navigate(['/login']))
        .catch(response => {
          const errorMessage: string = response.error.message;

          // Display error if submitted email violates foreign key restraint:
          if (errorMessage && errorMessage.includes('users_email_unique')) {
            this.emailError = 'Email address already in use';
            this.toggleSubmitButton();
          }
        });
    }
  }

  // ------------------------------------------------------------------------ //

  // Ensure "First Name" and "Last Name" fields contain values:
  validateInputLength(classNameStr) {
    const errorMessage = 'Required';
    const inputValue = document
      .getElementsByClassName(classNameStr)[0]
      ['value'].trim();

    switch (classNameStr) {
      case 'register-form-inner-input-first-name':
        if (this.checkEmptyInputField(inputValue)) {
          this.firstNameError = errorMessage;
        } else {
          this.firstNameError = '';
        }
        this.toggleSubmitButton();
        break;

      case 'register-form-inner-input-last-name':
        if (this.checkEmptyInputField(inputValue)) {
          this.lastNameError = errorMessage;
        } else {
          this.lastNameError = '';
        }
        this.toggleSubmitButton();
        break;

      default:
        break;
    }
  }

  checkEmptyInputField(str) {
    return str.length < 1 ? true : false;
  }

  validateEmail(eventTypeStr) {
    const emailErrorMessages = ['Required', 'Enter a valid email address'];
    const email = document
      .getElementsByClassName('register-form-inner-input-email')[0]
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
        this.toggleSubmitButton();
        break;

      default:
        break;
    }
  }

  validatePassword(eventTypeStr) {
    const errorMessage = 'Must be 8-16 characters in length';
    const password = document
      .getElementsByClassName('register-form-inner-input-password')[0]
      ['value'];

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
          (password.length >= 8 || password.length <= 16)
        ) {
          this.passwordError = '';
        }
        this.toggleSubmitButton();
        break;

      default:
        break;
    }
  }

  validatePasswordConfirm(eventTypeStr) {
    const passwordConfirmErrorMessages = [
      'Required',
      'Password entries do not match'
    ];
    const passwordConfirm = document
      .getElementsByClassName('register-form-inner-input-confirm')[0]
      ['value'].trim();

    switch (eventTypeStr) {
      case 'blur':
        // Display error if input does not satisfy the following tests:
        if (passwordConfirm === '') {
          this.passwordConfirmError = passwordConfirmErrorMessages[0];
        } else if (passwordConfirm !== this.registerFormData['password']) {
          this.passwordConfirmError = passwordConfirmErrorMessages[1];
        } else {
          this.passwordConfirmError = '';
        }
        this.toggleSubmitButton();
        break;

      case 'ngModelChange':
        // Immediately remove existing error message once valid input entered:
        if (
          this.passwordConfirmError &&
          passwordConfirm === this.registerFormData['password']
        ) {
          this.passwordConfirmError = '';
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
      this.emailError,
      this.passwordError,
      this.passwordConfirmError
    ];

    // Use "fake" disabled appearance to retain button functionality (allows the
    // user to continue to interact with the submit button and be presented with
    // appropriate error messages whenever the submit button is clicked):
    if (errorMessages.some(errorMessage => errorMessage.length > 0)) {
      submitButton.classList.add('disabled');
    } else if (
      !this.registerFormData['firstName'] ||
      !this.registerFormData['lastName'] ||
      !this.registerFormData['email'] ||
      !this.registerFormData['password'] ||
      !this.registerFormData['confirm']
    ) {
      submitButton.classList.add('disabled');
    } else {
      submitButton.classList.remove('disabled');
    }
  }
}
