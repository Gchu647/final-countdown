import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  logout() {
    return this.auth.logout()
    .then((response) => {
      console.log('Response @header_component: ', response);
    })
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch(response => {
      console.log(response.error.message);
    })
  }
}
