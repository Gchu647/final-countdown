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
      { path: 'home', component: AuthHomePageComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'messages/personal/new', component: MessagePersonalNewComponent },
      { path: 'messages/group/:id', component: MessageGroupComponent },
      { path: 'recipients', component: RecipientsComponent },
      { path: 'recipients/new', component: RecipientNewComponent },
      { path: 'recipients/:id', component: RecipientViewComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
