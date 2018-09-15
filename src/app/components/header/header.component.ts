import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private backend: BackendService
  ) {}

  logout() {
    return this.backend.logout()
    .then((response) => {
      console.log('Response from server logout:  ', response);
    })
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch(response => {
      console.log(response.error.message);
    })
  }
}
