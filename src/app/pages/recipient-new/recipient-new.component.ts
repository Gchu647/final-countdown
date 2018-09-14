import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipient-new',
  templateUrl: './recipient-new.component.html',
  styleUrls: ['./recipient-new.component.scss']
})
export class RecipientNewComponent implements OnInit {
  // Temporary variable (until database integrated):
  relationships: object[] = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friend' },
    { id: 3, name: 'Hater' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
