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
import { MessageNewComponent } from './pages/message-new/message-new.component';
import { RecipientNewComponent } from './pages/recipient-new/recipient-new.component';
import { RecipientsComponent } from './pages/recipients/recipients.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UnauthHomePageComponent,
    RegisterComponent,
    LoginComponent,
    AuthHomePageComponent,
    ProfileComponent,
    MessageNewComponent,
    RecipientNewComponent,
    RecipientsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: UnauthHomePageComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'home', component: AuthHomePageComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'messages/new', component: MessageNewComponent },
      { path: 'recipients/new', component: RecipientNewComponent },
      { path: 'recipients', component: RecipientsComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
