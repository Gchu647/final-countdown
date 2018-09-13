import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientViewComponent } from './recipient-view.component';

describe('RecipientViewComponent', () => {
  let component: RecipientViewComponent;
  let fixture: ComponentFixture<RecipientViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipientViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
