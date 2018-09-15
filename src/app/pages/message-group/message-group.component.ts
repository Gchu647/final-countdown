import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message-group',
  templateUrl: './message-group.component.html',
  styleUrls: ['./message-group.component.scss']
})
export class MessageGroupComponent implements OnInit {
  // Temporary variable(s) (until database integrated):
  relationships: object[] = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friends' },
    { id: 3, name: 'Haters' }
  ];
  message: string =
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum facilis, ipsa ipsam unde, veniam assumenda iste saepe cumque similique tenetur provident perspiciatis rem harum. Incidunt explicabo perspiciatis alias quis ipsa!';

  messageGroupId: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.messageGroupId = Number(params['id']);
    });
  }

  getGroupNameById(id) {
    return this.relationships
      .find(group => group['id'] === id)
      ['name'].toUpperCase();
  }
}
