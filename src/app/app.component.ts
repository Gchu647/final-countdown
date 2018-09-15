import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'final-countdown';

  // Source (Stack Overflow): https://goo.gl/ozCQCt
  // Used in hiding header on registration/login page:
  router: string;

  constructor(
    private _router: Router
  ) {
    this.router = _router.url;
  }
}
