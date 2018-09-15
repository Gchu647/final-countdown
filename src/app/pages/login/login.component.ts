import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    private auth: AuthService,
  ){};

  login() {
    return this.auth.login(this.loginFormData)
    .then((response) => {
      console.log('Response @login_component: ', response);
    })
    .then(() => {
      this.router.navigate(['/messages']);
    })
    .catch(response => {
      console.log(response.error.message);
    })
  }
}
