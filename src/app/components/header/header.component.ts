import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements DoCheck {
  constructor(private router: Router, private auth: AuthService) {}

  ngDoCheck() {
    if (document.getElementsByClassName('unauth-homepage')[0]) {
      const scrollArea = document.getElementsByClassName('unauth-homepage')[0];
      scrollArea.addEventListener('scroll', this.resizeHeaderOnScroll);
    }
  }

  logout() {
    return this.auth.logout()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(response => {
        console.log(response.error.message);
      });
  }

  // Allows .active-link class to be applied to '/messages' and all child paths:
  setActiveLink() {
    if (this.router.url.split('/')[1] === 'messages') {
      return 'active-link';
    }
  }

  resizeHeaderOnScroll() {
    const header = document.getElementsByClassName('header-title')[0];
    const container = document.getElementsByClassName('container')[0];
    const containerInner = document.getElementsByClassName('container-inner')[0];
    const scrollArea = document.getElementsByClassName('unauth-homepage')[0];

    const distanceY = scrollArea.scrollTop;
    const shrinkOn = 100;

    if (distanceY > shrinkOn) {
      header.classList.add('shrink');
      container.classList.add('grow');
      containerInner.classList.add('grow');
    } else {
      header.classList.remove('shrink');
      container.classList.remove('grow');
      containerInner.classList.remove('grow');
    }
  }
}
