import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-message-personal-new',
  templateUrl: './message-personal-new.component.html',
  styleUrls: ['./message-personal-new.component.scss']
})
export class MessagePersonalNewComponent implements OnInit {
  // Temporary variable(s) (until database integrated):
  recipientData: object = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    packageId: null,
    groupId: null, // No groupId for now
  };
  messageData: object = {
    title: '',
    message: '',
  };
  relationships: object[] = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friends' },
    { id: 3, name: 'Haters' }
  ];
  groups: object[];

  firstNameError: string = '';
  lastNameError: string = '';
  emailError: string = '';
  phoneError: string = '';

  constructor(
    private router: Router, 
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.validateName('message-new-add-recipient-form-input-first-name');
    this.validateName('message-new-add-recipient-form-input-last-name');
    this.validateEmail('blur');

    this.auth.fetchGroups()
      .then((response: object[]) => {
        console.log('fetch groups in message personal: ', response);
      })
  }

  save() {
    // Saves a package first with a message for aws_url
    return this.auth.addPackage(this.messageData)
      .then((response: object) => {
        // Save the recipient with the new packageId
        console.log('added package', response);
        this.recipientData['packageId'] = response['packageId'];

        this.auth.addRecipient(this.recipientData)
          .then((response) => {
            console.log('recipient save: ', response);
          })
      })
      .then(() => {
        this.router.navigate(['/messages']);
      });
  }

  // ------------------------------------------------------------------------ //
  validateName(classNameStr) {
    const nameErrorMessage = 'Required';
    const name = document
      .getElementsByClassName(classNameStr)[0]
      ['value'].trim();

    // Display error if first or last name input field is empty:
    switch (classNameStr) {
      case 'message-new-add-recipient-form-input-first-name':
        if (this.checkEmptyNameField(name)) {
          this.firstNameError = nameErrorMessage;
        } else {
          this.firstNameError = '';
        }
        this.toggleSubmitButton();
        break;
      case 'message-new-add-recipient-form-input-last-name':
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

  validateEmail(eventTypeStr) {
    const emailErrorMessages = ['Required', 'Enter a valid email address'];
    const email = document
      .getElementsByClassName('message-new-add-recipient-form-input-email')[0]
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

  validatePhoneNumber(eventTypeStr) {
    const phoneErrorMessage = 'Enter a valid 10-digit phone number';
    const phoneNumber = document
      .getElementsByClassName('message-new-add-recipient-form-input-phone')[0]
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
      this.emailError,
      this.phoneError
    ];

    if (errorMessages.some(errorMessage => errorMessage.length > 0)) {
      submitButton.setAttribute('disabled', '');
    } else if (
      !this.recipientData['firstName'] ||
      !this.recipientData['lastName'] ||
      !this.recipientData['email']
    ) {
      submitButton.setAttribute('disabled', '');
    } else {
      submitButton.removeAttribute('disabled');
    }
  }
}
