import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipient-view',
  templateUrl: './recipient-view.component.html',
  styleUrls: ['./recipient-view.component.scss']
})
export class RecipientViewComponent implements OnInit {
  formData: object;
  relationships: object[] = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friend' },
    { id: 3, name: 'Hater' }
  ];
  message: string =
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum facilis, ipsa ipsam unde, veniam assumenda iste saepe cumque similique tenetur provident perspiciatis rem harum. Incidunt explicabo perspiciatis alias quis ipsa!';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    // Getting the recipientId from URL
    let index = window.location.pathname.length -1;
    let recipientId = Number(window.location.pathname.charAt(index));
    console.log('recipientId: ', recipientId);

    this.auth.fetchRecpientById(recipientId)
    .then((response: object) => {
      this.formData = response;
      console.log('recipient view got: ', response);
    });
  }
}
