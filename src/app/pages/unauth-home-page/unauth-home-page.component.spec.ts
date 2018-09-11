import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthHomePageComponent } from './unauth-home-page.component';

describe('UnauthHomePageComponent', () => {
  let component: UnauthHomePageComponent;
  let fixture: ComponentFixture<UnauthHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
