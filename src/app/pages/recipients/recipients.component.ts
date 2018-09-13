import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.scss']
})
export class RecipientsComponent implements OnInit {
  // Temporary variables (until database integrated):
  recipientIndividuals: object[] = [
    { id: 1, first_name: 'Adam', last_name: 'Alpha' },
    { id: 2, first_name: 'Ben', last_name: 'Beta' },
    { id: 3, first_name: 'Greg', last_name: 'Gamma' }
  ];
  recipientGroups: object[] = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friends' },
    { id: 3, name: 'Haters' }
  ];

  constructor() {}

  ngOnInit() {}
}
