import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  RegisterFormData: {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    confirm: string
  } = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirm: ''
  };

  constructor(
    private router: Router,
    private backend: BackendService,
  ) {};

  ngOnInit() {
    console.log('Register Component initiated');
  }

  register() {
    if(this.RegisterFormData.password !== this.RegisterFormData.confirm) {
      throw new Error('password and confirm password does not match');
    }

    return this.backend.register(this.RegisterFormData)
    .then((response) => {
      console.log('Response @register_component: ', response);
    })
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch(response => {
      console.log(response.error.message);
    });
  }
}
