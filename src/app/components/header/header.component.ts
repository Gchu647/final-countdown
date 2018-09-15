import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    private _router: Router
  ) {
    this.router = _router.url;
  }
}
