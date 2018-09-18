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
  activationModalEnabled: boolean;
  deactivationModalEnabled: boolean;
  messagesSentModalEnabled: boolean;

  // Countdown:
  countdownActive: boolean;
  countdownDayValue: number = 7;
  countdownDays: number[] = [];
  countdownDisplay: object;
  countdownIntervalId: number;
  countdownExpired: boolean;

  constructor(
    private auth: AuthService,
    private backend: BackendService,
    private session: SessionsService
  ) {
    this.user = this.session.getSession();
  }

  ngOnInit() {
    this.activationModalEnabled = false;
    this.deactivationModalEnabled = false;
    this.messagesSentModalEnabled = false;
    this.countdownActive = false;
    this.countdownExpired = false;

    // Fill countdownDays with preset values (1-30) to be selected by user:
    for (let i = 1; i <= 30; i++) {
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
      .catch(err => console.log(err));
  }

  setActiveCountdown() {
    this.countdownActive = true;
    // Set initial countdown display:
    this.getTimeUntil(this.triggerData['countdown']);
    // Update countdown display every second:
    this.countdownIntervalId = window.setInterval(
      () => this.getTimeUntil(this.triggerData['countdown']),
      1000
    );
  }

  getTimeUntil(deadline) {
    const timeRemaining =
      Date.parse(deadline) - Date.parse(new Date().toUTCString());

    if (timeRemaining >= 0) {
      this.countdownDisplay = {
        days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeRemaining / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((timeRemaining / 1000 / 60) % 60),
        seconds: Math.floor((timeRemaining / 1000) % 60)
      };
    } else if (this.countdownActive) { // Prevent attempt to delete null trigger
      this.backend
        .deactivateTrigger(this.user['userId'])
        .then(response => {
          window.clearInterval(this.countdownIntervalId);
          this.toggleMessagesSentModal();
          this.triggerData = response;
          this.countdownActive = false;
          this.countdownExpired = true;
          this.countdownDisplay = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };
        })
        .catch(err => console.log(err));
    }
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

  toggleMessagesSentModal() {
    this.messagesSentModalEnabled = !this.messagesSentModalEnabled;
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
        })
        .catch(err => console.log(err));
    }

    if (this.deactivationModalEnabled) {
      return this.backend
        .deactivateTrigger(this.user['userId'])
        .then(response => {
          this.triggerData = response;
          this.countdownActive = false;
          this.toggleDeactivationModal();
        })
        .catch(err => console.log(err));
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
  }
}
