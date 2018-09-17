import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-home-page',
  templateUrl: './auth-home-page.component.html',
  styleUrls: ['./auth-home-page.component.scss']
})
export class AuthHomePageComponent implements OnInit {
  // Temporary variables (until database integrated):
  // recipients: object[] = [
  //   { id: 1, first_name: 'Adam', last_name: 'Alpha', relationshipId: 1 },
  //   { id: 2, first_name: 'Ben', last_name: 'Beta', relationshipId: 2 },
  //   { id: 3, first_name: 'Greg', last_name: 'Gamma', relationshipId: 3 }
  // ];
  recipients: object[];
  relationships: object[];
  relationshipToFilter: number = 0;
  displayedRecipients: object[];

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

    // WORKING on get recipients from server and capitalize first letter of each:
    this.auth.fetchRecipients()
      .then((response: object[]) => {
        this.recipients = response;
        this.displayedRecipients = this.recipients;
        console.log('auth-homepage got: ', response);
      })

  }

  // GChu didn't get to use this method yet
  setRelationshipToFilter(value) {
    this.relationshipToFilter = Number(value);
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
}
