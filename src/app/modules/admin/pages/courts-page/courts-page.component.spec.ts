import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtsPageComponent } from './courts-page.component';

describe('CourtsPageComponent', () => {
  let component: CourtsPageComponent;
  let fixture: ComponentFixture<CourtsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourtsPageComponent]
    });
    fixture = TestBed.createComponent(CourtsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
