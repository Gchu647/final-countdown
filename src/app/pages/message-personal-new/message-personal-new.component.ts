import { Component } from '@angular/core';

@Component({
  selector: 'app-message-personal-new',
  templateUrl: './message-personal-new.component.html',
  styleUrls: ['./message-personal-new.component.scss']
})
export class MessagePersonalNewComponent {
  // Temporary variable(s) (until database integrated):
  relationships: object[] = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friends' },
    { id: 3, name: 'Haters' }
  ];

  constructor() {}
}
