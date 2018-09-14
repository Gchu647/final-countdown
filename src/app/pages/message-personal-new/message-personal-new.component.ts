import { Component } from '@angular/core';

@Component({
  selector: 'app-message-personal-new',
  templateUrl: './message-personal-new.component.html',
  styleUrls: ['./message-personal-new.component.scss']
})
export class MessagePersonalNewComponent {
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

  showNewRecipientForm: boolean = false;

  constructor() {}

  toggleNewRecipientForm() {
    const scrollArea = document.getElementsByClassName('message-new')[0];

    this.showNewRecipientForm
      ? (this.showNewRecipientForm = false)
      : (this.showNewRecipientForm = true);

    // Force view to return to the top of the page after toggling form:
    scrollArea.scrollTop = 0;
  }
}
