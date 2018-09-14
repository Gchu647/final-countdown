import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePersonalNewComponent } from './message-personal-new.component';

describe('MessagePersonalNewComponent', () => {
  let component: MessagePersonalNewComponent;
  let fixture: ComponentFixture<MessagePersonalNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagePersonalNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagePersonalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
