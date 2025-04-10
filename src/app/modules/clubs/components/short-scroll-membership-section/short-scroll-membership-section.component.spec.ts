import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortScrollMembershipSectionComponent } from './short-scroll-membership-section.component';

describe('ShortScrollMembershipSectionComponent', () => {
  let component: ShortScrollMembershipSectionComponent;
  let fixture: ComponentFixture<ShortScrollMembershipSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShortScrollMembershipSectionComponent]
    });
    fixture = TestBed.createComponent(ShortScrollMembershipSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
