import { Component, OnInit } from '@angular/core';

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
  relationships: object[] = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friends' },
    { id: 3, name: 'Haters' }
  ];

  constructor() {}

  ngOnInit() {}
}
