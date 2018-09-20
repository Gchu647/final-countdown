import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { SessionsService } from '../../services/sessions.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipient-view',
  templateUrl: './recipient-view.component.html',
  styleUrls: ['./recipient-view.component.scss']
})
export class RecipientViewComponent implements OnInit {
  user: {
    loggedIn: boolean;
    email: string;
    userId: number;
  };
  formData: object = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    groupId: ''
  };
  messageData: object = {
    title: '',
    message: '',
  };
  groups: object[];

  // Tacking ids
  recipientId: number;
  packageId: number;

  // Errors:
  firstNameError: string = '';
  lastNameError: string = '';
  emailError: string = '';
  phoneError: string = '';

  constructor(
    private router: Router,
    private backend: BackendService,
    private session: SessionsService,
    private auth: AuthService
  ) {
    this.user = this.session.getSession();
  }

  ngOnInit() {
    // Get user's groups from server and capitalize first letter of each:
    this.backend.fetchGroups(this.user['userId'])
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
      .then(() => {
        // This step must occur after groups have been fetched to ensure that
        // the "Relationship" dropdown menu is populated appropriately:
        return this.getRecipientById(this.recipientId)
      })
      .then(() => {
        // Get the package file message if packageId is not null
        if(this.packageId) {
          return this.fetchPackageById(this.packageId)
        }
      })
      .catch(err => console.log(err));

    // Get recipientId from window URL:
    let index = window.location.pathname.lastIndexOf('/');
    this.recipientId = Number(window.location.pathname.slice(index + 1));
  }

  getRecipientById(recipientId) {
    return this.auth.fetchRecpientById(recipientId).then((response: object) => {
      this.packageId = response['packageId'];
      this.formData = response;
    });
  }

  fetchPackageById(packageId) {
    return this.auth.fetchPackageById(packageId).then((response: object) => {
      console.log('fetchPackageById: ', response['file'][0]['aws_url']);
      this.messageData['message'] = response['file'][0]['aws_url'];
      this.messageData['title'] = response['file'][0]['name'];
    });
  }

  saveChanges() {
    // Edits a recipient's package by its id
    this.auth.editPackageById(this.packageId, this.messageData)
    .then((response: object) => {
      console.log('edited package: ', response);

      // Then save the save changes recipient's info
      return this.auth.editRecipientById(this.recipientId, this.formData)
        .then((response: object) => {
          this.formData = response;
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
      case 'recipient-view-form-inner-input-first-name':
        if (this.checkEmptyNameField(name)) {
          this.firstNameError = nameErrorMessage;
        } else {
          this.firstNameError = '';
        }
        this.toggleSubmitButton();
        break;
      case 'recipient-view-form-inner-input-last-name':
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
      .getElementsByClassName('recipient-view-form-inner-input-email')[0]
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
      .getElementsByClassName('recipient-view-form-inner-input-phone')[0]
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
        // (2) text input does not match any regular expressions above:
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
      !this.formData['firstName'] ||
      !this.formData['lastName'] ||
      !this.formData['email']
    ) {
      submitButton.setAttribute('disabled', '');
    } else {
      submitButton.removeAttribute('disabled');
    }
  }
}
