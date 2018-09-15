import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthHomePageComponent } from './auth-home-page.component';

describe('AuthHomePageComponent', () => {
  let component: AuthHomePageComponent;
  let fixture: ComponentFixture<AuthHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
