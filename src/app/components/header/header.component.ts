import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Source (Stack Overflow): https://goo.gl/ozCQCt
  // Used in displaying specific header links for authenticated users:
  router: string;

  constructor(
    private _router: Router,
    private backend: BackendService
  ) {
    this.router = _router.url;
  }

  logout() {
    return this.backend.logout()
    .then((response) => {
      console.log('Response from server logout:  ', response);
    })
    .catch(response => {
      console.log(response.error.message);
    })
  }
}
