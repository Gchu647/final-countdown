import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Components:
import { HeaderComponent } from './components/header/header.component';

// Pages:
import { UnauthHomePageComponent } from './pages/unauth-home-page/unauth-home-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthHomePageComponent } from './pages/auth-home-page/auth-home-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MessagePersonalNewComponent } from './pages/message-personal-new/message-personal-new.component';
import { MessageGroupComponent } from './pages/message-group/message-group.component';
import { RecipientsComponent } from './pages/recipients/recipients.component';
import { RecipientNewComponent } from './pages/recipient-new/recipient-new.component';
import { RecipientViewComponent } from './pages/recipient-view/recipient-view.component';

// Services:
import { BackendService } from './services/backend.service';
import { SessionsService } from './services/sessions.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UnauthHomePageComponent,
    RegisterComponent,
    LoginComponent,
    AuthHomePageComponent,
    ProfileComponent,
    MessagePersonalNewComponent,
    MessageGroupComponent,
    RecipientsComponent,
    RecipientNewComponent,
    RecipientViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: UnauthHomePageComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'messages/group/:id', component: MessageGroupComponent },
      { path: 'messages/personal/new', component: MessagePersonalNewComponent },
      { path: 'messages/personal/:id', component: RecipientViewComponent },
      { path: 'messages', component: AuthHomePageComponent }
    ])
  ],
  providers: [
    BackendService,
    SessionsService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
