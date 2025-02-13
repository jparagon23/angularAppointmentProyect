import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultShortSectionComponent } from './result-short-section.component';

describe('ResultShortSectionComponent', () => {
  let component: ResultShortSectionComponent;
  let fixture: ComponentFixture<ResultShortSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultShortSectionComponent]
    });
    fixture = TestBed.createComponent(ResultShortSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
