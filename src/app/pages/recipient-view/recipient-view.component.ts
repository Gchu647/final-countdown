import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    message: ''
  };
  groups: object[];

  // Tracking IDs:
  recipientId: number;
  packageId: number;

  // Errors:
  firstNameError: string = '';
  lastNameError: string = '';
  emailError: string = '';
  phoneError: string = '';
  messageError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendService,
    private session: SessionsService,
    private auth: AuthService
  ) {
    this.user = this.session.getSession();
  }

  ngOnInit() {
    // Set recipientId based upon route info provivded by "ActivatedRoute":
    this.recipientId = Number(this.route.params['value']['id']);

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
        return this.getRecipientById(this.recipientId);
      })
      .then(() => {
        // Get the package file message if packageId is not null:
        if (this.packageId) {
          return this.fetchPackageById(this.packageId);
        }
      })
      .catch(err => console.log(err));
  }

  getRecipientById(recipientId) {
    return this.auth.fetchRecpientById(recipientId).then((response: object) => {
      this.packageId = response['packageId'];
      this.formData = response;
    });
  }

  fetchPackageById(packageId) {
    return this.auth.fetchPackageById(packageId).then((response: object) => {
      console.log('fetchPackageById: ', response);
      this.messageData['title'] = response['title'];
      this.messageData['message'] = response['message'];
      // this.messageData['message'] = response['file'][0]['aws_url'];
      // this.messageData['title'] = response['file'][0]['name'];
    });
  }

  saveChanges() {
    // Edits a recipient's package by packageId:
    return this.backend.editPackageEncryptedFile(
        this.user['userId'],
        this.packageId,
        this.messageData
      )
      .then(() => {
        // Save changes to recipient's info:
        return this.auth.editRecipientById(this.recipientId, this.formData)
          .then((response: object) => {
            this.formData = response;
          });
      })
      .then(() => {
        this.router.navigate(['/messages']);
      });
  }

  deleteRecipient() {
    // Deletes (flags) a package by packageId:
    return this.backend.deletePackageById(this.user['userId'], this.packageId)
      .then(response => {
        // Deletes (flags) a recipient by recipientId:
        return this.backend
          .deleteRecipientById(this.user['userId'], this.recipientId)
          .then(() => {
            console.log('recipient deleted');
          });
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
      case 'recipient-view-form-inner-input-first-name':
        if (this.checkEmptyInputField(inputValue)) {
          this.firstNameError = errorMessage;
        } else {
          this.firstNameError = '';
        }
        this.toggleSubmitButton();
        break;

      case 'recipient-view-form-inner-input-last-name':
        if (this.checkEmptyInputField(inputValue)) {
          this.lastNameError = errorMessage;
        } else {
          this.lastNameError = '';
        }
        this.toggleSubmitButton();
        break;

      case 'recipient-view-form-inner-input-message':
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
      .getElementsByClassName('recipient-view-form-inner-input-phone')[0]
      ['value'].trim();

    // Source: www.w3resource.com/javascript/form/phone-no-validation.php
    const validRegexNumbers: any[] = [
      /^\d{10}$/,
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
    ];

    switch (eventTypeStr) {
      // Display error if (1) user enters text into phone number input, and
      // (2) text input does not match any regular expressions above:
      case 'blur':
        if (phoneNumber === '') {
          this.phoneError = '';
        } else {
          if (!validRegexNumbers.some(regex => regex.test(phoneNumber))) {
            this.phoneError = phoneErrorMessage;
          }
        }
        this.toggleSubmitButton();
        break;

      // Immediately removes existing error message once valid input entered:
      case 'ngModelChange':
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
      !this.formData['firstName'] ||
      !this.formData['lastName'] ||
      !this.formData['email'] ||
      !this.messageData['message']
    ) {
      submitButton.setAttribute('disabled', '');
    } else {
      submitButton.removeAttribute('disabled');
    }
  }
}
