import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.scss']
})
export class RecipientsComponent implements OnInit {
  // Temporary variables (until database integrated):
  recipients: object[] = [
    { id: 1, first_name: 'Adam', last_name: 'Alpha', relationshipId: 1 },
    { id: 2, first_name: 'Ben', last_name: 'Beta', relationshipId: 2 },
    { id: 3, first_name: 'Greg', last_name: 'Gamma', relationshipId: 3 }
  ];
  relationships: object[] = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friends' },
    { id: 3, name: 'Haters' }
  ];

  constructor() {}

  ngOnInit() {}
}
