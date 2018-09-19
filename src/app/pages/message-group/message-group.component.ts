import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionsService } from '../../services/sessions.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-message-group',
  templateUrl: './message-group.component.html',
  styleUrls: ['./message-group.component.scss']
})
export class MessageGroupComponent implements OnInit {
  // Temporary variable(s) (until database integrated):
  message: string =
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum facilis, ipsa ipsam unde, veniam assumenda iste saepe cumque similique tenetur provident perspiciatis rem harum. Incidunt explicabo perspiciatis alias quis ipsa!';

  user: {
    loggedIn: boolean;
    email: string;
    userId: number;
  };

  groups: object[];
  groupId: number;
  groupName: object;
  groupMembers: object;

  constructor(
    private route: ActivatedRoute,
    private session: SessionsService,
    private backend: BackendService
  ) {
    this.user = this.session.getSession();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.groupId = Number(params['id']);
    });

    this.getGroups();
    this.getGroupName();
    this.getGroupMembers();
  }

  getGroups() {
    this.backend.fetchGroups(this.user['userId']).then(response => {
      console.log('GROUPS', response);
    });
  }

  getGroupName() {
    this.backend
      .fetchGroup(this.user['userId'], this.groupId)
      .then(response => {
        console.log('groupName', response['relationship']['name']);
        this.groupName = response['relationship']['name'];
      });
  }

  getGroupMembers() {
    this.backend
      .fetchGroupMembers(this.user['userId'], this.groupId)
      .then(response => {
        console.log('groupMembers', response['members']);
        this.groupMembers = response['members'];
      });
  }
}
