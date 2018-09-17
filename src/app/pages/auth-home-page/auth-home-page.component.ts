import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-home-page',
  templateUrl: './auth-home-page.component.html',
  styleUrls: ['./auth-home-page.component.scss']
})
export class AuthHomePageComponent implements OnInit {
  countdownDays = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30
  ];
  recipients: object[];
  relationships: object[];
  relationshipToFilter: number = 0;
  displayedRecipients: object[];
  confirmationModalEnabled: boolean = false;
  countdownActive: boolean = false;
  countdownDayValue: number = 7;

  constructor(
    private backend: BackendService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // Get relationships from server and capitalize first letter of each:
    this.backend.fetchRelationships().then((response: object[]) => {
      const capitalizedRelationships = response.map(relationship => {
        const capitalizedRelationship = Object.assign(relationship);
        capitalizedRelationship['name'] =
          capitalizedRelationship.name.charAt(0).toUpperCase() +
          capitalizedRelationship.name.substr(1);
        return capitalizedRelationship;
      });

      this.relationships = capitalizedRelationships;
    });

    // Gets recipients from server:
    this.auth.fetchRecipients()
      .then((response: object[]) => {
        this.recipients = response;
        this.displayedRecipients = this.recipients;
      });

  }

  setRelationshipToFilter(value) {
    this.relationshipToFilter = Number(value);
    this.filterDisplayedRecipients(Number(value));
  }

  filterDisplayedRecipients(value) {
    if (Number(value) === 0) {
      this.displayedRecipients = this.recipients;
    } else {
      this.displayedRecipients = this.recipients.filter(
        // might have to have add in a withRelated later
        recipient => Number(recipient['group_id']) === Number(value)
      );
    }
  }

  toggleConfirmationModal() {
    this.confirmationModalEnabled = !this.confirmationModalEnabled;
  }

  toggleActiveCountdown() {
    this.countdownActive = !this.countdownActive;
    this.toggleConfirmationModal();
  }

  stopPropagation(event) {
    event.stopPropagation();
  }
}
