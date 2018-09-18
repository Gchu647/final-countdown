import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';
import { SessionsService } from './../../services/sessions.service';

import * as moment from 'moment';

@Component({
  selector: 'app-auth-home-page',
  templateUrl: './auth-home-page.component.html',
  styleUrls: ['./auth-home-page.component.scss']
})
export class AuthHomePageComponent implements OnInit {
  user: {
    loggedIn: boolean;
    email: string;
    userId: number;
  };
  recipients: object[];
  relationships: object[];
  relationshipToFilter: number = 0;
  displayedRecipients: object[];
  triggerData: object;

  // Modals:
  activationModalEnabled: boolean = false;
  deactivationModalEnabled: boolean = false;

  // Countdown:
  countdownActive: boolean = false;
  countdownDayValue: number = 7;
  countdownDays: number[] = [];
  countdownDisplay: object;

  constructor(
    private auth: AuthService,
    private backend: BackendService,
    private session: SessionsService
  ) {
    this.user = this.session.getSession();
  }

  ngOnInit() {
    // Fill countdownDays with preset values (1-30) to be selected by user:
    for (let i = 1; i < 31; i++) {
      this.countdownDays.push(i);
    }

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
    this.auth.fetchRecipients().then((response: object[]) => {
      this.recipients = response;
      this.displayedRecipients = this.recipients;
    });

    // Retrieve countdown expiration timer:
    this.backend
      .fetchTrigger(this.user['userId'])
      .then(response => {
        if (response) {
          return (this.triggerData = response);
        }
      })
      .then(response => {
        if (response && response['countdown']) {
          this.setActiveCountdown();
        }
      })
      .catch(err => {
        console.log('Trigger Retrieval Error:', err);
      });
  }

  setActiveCountdown() {
    this.countdownActive = true;
    // Set initial countdown display:
    this.getTimeUntil(this.triggerData['countdown']);
    // Update countdown display every second:
    setInterval(() => this.getTimeUntil(this.triggerData['countdown']), 1000);
  }

  getTimeUntil(deadline) {
    const timeRemaining =
      Date.parse(deadline) - Date.parse(new Date().toUTCString());

    this.countdownDisplay = {
      days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeRemaining / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeRemaining / 1000 / 60) % 60),
      seconds: Math.floor((timeRemaining / 1000) % 60)
    };
  }

  getFormattedTime(timeStr) {
    // Example: Mon, Sep 17, 2018 4:32 PM
    return moment(timeStr).format('llll');
  }

  getFormattedTimeZone(timeStr) {
    // Returns time zone without surrounding parentheses:
    return new Date(timeStr)
      .toTimeString()
      .split('(')[1]
      .slice(0, -1);
  }

  addLeadingZero(num) {
    return num < 10 ? '0' + num : num;
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

  toggleActivationModal() {
    this.activationModalEnabled = !this.activationModalEnabled;
  }

  toggleDeactivationModal() {
    this.deactivationModalEnabled = !this.deactivationModalEnabled;
  }

  toggleActiveCountdown() {
    this.countdownActive = !this.countdownActive;

    if (this.activationModalEnabled) {
      return this.backend
        .activateTrigger(this.user['userId'], this.countdownDayValue)
        .then(response => {
          this.triggerData = response;
          this.setActiveCountdown();
          this.toggleActivationModal();
        });
    }

    if (this.deactivationModalEnabled) {
      return this.backend
        .deactivateTrigger(this.user['userId'])
        .then(response => {
          this.triggerData = response;
          this.countdownActive = false;
          this.toggleDeactivationModal();
        });
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
  }
}
