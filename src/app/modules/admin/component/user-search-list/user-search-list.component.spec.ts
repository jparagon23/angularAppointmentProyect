import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchListComponent } from './user-search-list.component';

describe('UserSearchListComponent', () => {
  let component: UserSearchListComponent;
  let fixture: ComponentFixture<UserSearchListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSearchListComponent]
    });
    fixture = TestBed.createComponent(UserSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
