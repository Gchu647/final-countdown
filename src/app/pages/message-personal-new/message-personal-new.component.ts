import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'app-message-personal-new',
  templateUrl: './message-personal-new.component.html',
  styleUrls: ['./message-personal-new.component.scss']
})
export class MessagePersonalNewComponent implements OnInit {
  // User:
  user: {
    loggedIn: boolean;
    email: string;
    userId: number;
  };
  groups: object[];

  // Recipient:
  recipientData: object = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    packageId: null,
    groupId: null
  };
  messageData: object = {
    title: '',
    message: ''
  };

  // Errors:
  firstNameError: string = '';
  lastNameError: string = '';
  emailError: string = '';
  phoneError: string = '';
  messageError: string = '';

  constructor(
    private router: Router,
    private session: SessionsService,
    private backend: BackendService,
    private auth: AuthService
  ) {
    this.user = this.session.getSession();
  }

  ngOnInit() {
    this.validateInputLength('message-new-add-recipient-form-input-first-name');
    this.validateInputLength('message-new-add-recipient-form-input-last-name');
    this.validateInputLength('message-new-text-form-input-message');
    this.validateEmail('blur');

    // Get user's groups from server and capitalize first letter of each:
    this.backend
      .fetchGroups(this.user['userId'])
      .then((response: object[]) => {
        const groups = response.map(group => {
          return {
            id: group['id'],
            name: group['relationship']['name']
          };
        });

        const capitalizedGroups = groups.map(group => {
          const capitalizedGroup = Object.assign(group);
          capitalizedGroup['name'] =
            capitalizedGroup.name.charAt(0).toUpperCase() +
            capitalizedGroup.name.substr(1);
          return capitalizedGroup;
        });

        return (this.groups = capitalizedGroups);
      })
      .catch(err => console.log(err));
  }

  save() {
    // Saves a package first with a message for aws_url
    return this.auth
      .addPackage(this.messageData)
      .then((response: object) => {
        // Save the recipient with the new packageId
        this.recipientData['packageId'] = response['packageId'];

        return this.auth.addRecipient(this.recipientData);
      })
      .then(() => {
        this.router.navigate(['/messages']);
      });
  }

  // ------------------------------------------------------------------------ //

  // Validates input length of "First Name", "Last Name", and "Message":
  validateInputLength(classNameStr) {
    const errorMessage = 'Required';
    const inputValue = document
      .getElementsByClassName(classNameStr)[0]
      ['value'].trim();

    // Display error if input field is empty:
    switch (classNameStr) {
      case 'message-new-add-recipient-form-input-first-name':
        if (this.checkEmptyInputField(inputValue)) {
          this.firstNameError = errorMessage;
        } else {
          this.firstNameError = '';
        }
        this.toggleSubmitButton();
        break;

      case 'message-new-add-recipient-form-input-last-name':
        if (this.checkEmptyInputField(inputValue)) {
          this.lastNameError = errorMessage;
        } else {
          this.lastNameError = '';
        }
        this.toggleSubmitButton();
        break;

      case 'message-new-text-form-input-message':
        if (this.checkEmptyInputField(inputValue)) {
          this.messageError = errorMessage;
        } else {
          this.messageError = '';
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
      // Display error if input does not satisfy the following tests:
      case 'blur':
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

      // Immediately removes existing error message once valid input entered:
      case 'ngModelChange':
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
      this.phoneError,
      this.messageError
    ];

    if (errorMessages.some(errorMessage => errorMessage.length > 0)) {
      submitButton.setAttribute('disabled', '');
    } else if (
      !this.recipientData['firstName'] ||
      !this.recipientData['lastName'] ||
      !this.recipientData['email'] ||
      !this.messageData['message']
    ) {
      submitButton.setAttribute('disabled', '');
    } else {
      submitButton.removeAttribute('disabled');
    }
  }
}
