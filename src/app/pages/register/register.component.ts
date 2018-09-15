import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  RegisterFormData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  } = {
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  };

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    console.log('Register Component initiated');
  }

  register() {
    return this.auth.register(this.RegisterFormData)
      .then(response => {
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
