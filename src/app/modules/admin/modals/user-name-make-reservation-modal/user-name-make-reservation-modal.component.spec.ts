import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNameMakeReservationModalComponent } from './user-name-make-reservation-modal.component';

describe('UserNameMakeReservationModalComponent', () => {
  let component: UserNameMakeReservationModalComponent;
  let fixture: ComponentFixture<UserNameMakeReservationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserNameMakeReservationModalComponent]
    });
    fixture = TestBed.createComponent(UserNameMakeReservationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
