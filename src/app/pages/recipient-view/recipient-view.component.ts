import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-recipient-view',
  templateUrl: './recipient-view.component.html',
  styleUrls: ['./recipient-view.component.scss']
})
export class RecipientViewComponent implements OnInit {
  formData: object;
  relationships: object[];
  recipientId: number;
  message: string =
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum facilis, ipsa ipsam unde, veniam assumenda iste saepe cumque similique tenetur provident perspiciatis rem harum. Incidunt explicabo perspiciatis alias quis ipsa!';

  constructor(
    private router: Router,
    private backend: BackendService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // Get relationships from server and capitalize first letter of each:
    this.backend.fetchRelationships().then((response: object[]) => {
      const capitalizedRelationships = response.map(relationship => {
        const capitalizedRelationship = Object.assign(relationship);
        capitalizedRelationship['name'] =
          capitalizedRelationship.name.charAt(0).toUpperCase() +
          capitalizedRelationship.name.substr(1);
        return capitalizedRelationship;
      });

      this.relationships = capitalizedRelationships;
    });
    
    
    // Getting the recipientId from URL
    let index = window.location.pathname.length -1;
    this.recipientId = Number(window.location.pathname.charAt(index));
    
    // Getting the recipient info using recipientId
    this.auth.fetchRecpientById(this.recipientId)
      .then((response: object) => {
        this.formData = response;
        // console.log('recipient fetch: ', response);
      });
  }

  saveChanges() {
    this.auth.editRecipientById(this.recipientId, this.formData)
      .then((response: object) => {
        this.formData = response;
      })
      .then(() => {
        this.router.navigate(['/messages']);
      });
  }
}
