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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UnauthHomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: UnauthHomePageComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
