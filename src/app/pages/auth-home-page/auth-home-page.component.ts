import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-auth-home-page',
  templateUrl: './auth-home-page.component.html',
  styleUrls: ['./auth-home-page.component.scss']
})
export class AuthHomePageComponent implements OnInit {
  // Temporary variables (until database integrated):
  recipients: object[] = [
    { id: 1, first_name: 'Adam', last_name: 'Alpha', relationshipId: 1 },
    { id: 2, first_name: 'Ben', last_name: 'Beta', relationshipId: 2 },
    { id: 3, first_name: 'Greg', last_name: 'Gamma', relationshipId: 3 }
  ];
  // relationships: object[] = [
  //   { id: 1, name: 'Family' },
  //   { id: 2, name: 'Friends' },
  //   { id: 3, name: 'Haters' }
  // ];
  relationships: any;

  relationshipToFilter: number = 0;
  displayedRecipients: object[];

  constructor(
    private backend: BackendService
  ) {}

  ngOnInit() {
    this.displayedRecipients = this.recipients;
    // Getting relationships from backend
     this.backend.fetchRelationships()
    .then(response => {
      this.relationships = response;
      console.log('getting relationships', response);
    })
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
        recipient => Number(recipient['relationshipId']) === Number(value)
      );
    }
  }
}
