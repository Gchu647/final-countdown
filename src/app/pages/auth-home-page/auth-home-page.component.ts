import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';
import { SessionsService } from './../../services/sessions.service';

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
  groups: object[];
  groupToFilter: number = 0;
  recipients: object[];
  displayedRecipients: object[];

  // Modals:
  activationModalEnabled: boolean;
  deactivationModalEnabled: boolean;
  messagesSentModalEnabled: boolean;

  // Trigger/Countdown:
  triggerData: object;
  countdownActive: boolean;
  countdownDayValue: number = 7;
  countdownDays: number[] = [];
  countdownDisplay: object;
  countdownIntervalId: number;
  countdownExpired: boolean;
  enRouteNotificationPending: boolean;

  // ------------------------------------------------------------------------ //

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
    this.countdownDisplay = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    // Fill countdownDays with preset values (1-30) to be selected by user:
    for (let i = 1; i <= 30; i++) {
      this.countdownDays.push(i);
    }

    // Get user's groups from server and capitalize first letter of each:
    this.backend.fetchGroups(this.user['userId']).then((response: object[]) => {
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

      this.groups = capitalizedGroups;
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

  // ------------------------------------------------------------------------ //

  setRelationshipToFilter(value) {
    this.groupToFilter = Number(value);
    this.filterDisplayedRecipients(Number(value));
  }

  filterDisplayedRecipients(value) {
    if (Number(value) === 0) {
      this.displayedRecipients = this.recipients;
    } else {
      this.displayedRecipients = this.recipients.filter(
        recipient => Number(recipient['group_id']) === Number(value)
      );
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  // ------------------------------------------------------------------------ //

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
    } else if (this.countdownActive) {
      // Prevent attempt to delete null trigger
      this.backend
        .deactivateTrigger(this.user['userId'], 'false')
        .then(response => {
          window.clearInterval(this.countdownIntervalId);

          this.triggerData = response;
          this.countdownActive = false;
          this.countdownExpired = true;
          this.countdownDisplay = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };
          this.toggleMessagesSentModal(null);
        })
        .catch(err => console.log(err));
    } else if (isNaN(timeRemaining)) {
      // Stop countdown if this.triggerData['countdown'] is "null":
      window.clearInterval(this.countdownIntervalId);
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

  // ------------------------------------------------------------------------ //

  toggleActivationModal() {
    this.activationModalEnabled = !this.activationModalEnabled;
  }

  toggleDeactivationModal() {
    this.deactivationModalEnabled = !this.deactivationModalEnabled;
  }

  toggleMessagesSentModal(typeStr) {
    // Close deactivation modal if open, as trigger can no longer be canceled:
    if (this.deactivationModalEnabled) {
      this.toggleDeactivationModal();
    }

    if (typeStr === 'click') {
      this.backend
        .acknowledgeNotification(this.user['userId'])
        .then(response => {
          this.messagesSentModalEnabled = !this.messagesSentModalEnabled;
        })
        .catch(err => console.log(err));
    } else if (typeStr === 'open') {
      this.messagesSentModalEnabled = !this.messagesSentModalEnabled;
    } else if (typeStr === null) {
      this.messagesSentModalEnabled = !this.messagesSentModalEnabled;
    }
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
        .deactivateTrigger(this.user['userId'], 'true')
        .then(response => {
          this.triggerData = response;
          this.countdownActive = false;
          this.toggleDeactivationModal();
        })
        .catch(err => console.log(err));
    }
  }
}
