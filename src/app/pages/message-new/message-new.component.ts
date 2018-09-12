import { Component } from '@angular/core';

@Component({
  selector: 'app-message-new',
  templateUrl: './message-new.component.html',
  styleUrls: ['./message-new.component.scss']
})
export class MessageNewComponent {
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

  constructor() { }

}
