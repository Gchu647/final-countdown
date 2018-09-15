import { Component } from '@angular/core';
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
    private backend: BackendService
  ){};

  login() {
    return this.backend.login(this.loginFormData)
    .then((response) => {
      console.log('Response from server login: ', response);
    })
    .catch(response => {
      console.log(response.error.message);
    })
  }
}
