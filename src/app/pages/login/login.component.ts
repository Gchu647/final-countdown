import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginFormData: {
    email: string,
    password: string,
  } = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private backend: BackendService
  ){};

  login() {
    return this.backend.login(this.loginFormData)
    .then((response) => {
      console.log('Response from server login: ', response);
    })
    .then(() => {
      this.router.navigate(['/messages']);
    })
    .catch(response => {
      console.log(response.error.message);
    })
  }
}
