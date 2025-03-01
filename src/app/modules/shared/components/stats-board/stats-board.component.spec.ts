import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsBoardComponent } from './stats-board.component';

describe('StatsBoardComponent', () => {
  let component: StatsBoardComponent;
  let fixture: ComponentFixture<StatsBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsBoardComponent]
    });
    fixture = TestBed.createComponent(StatsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
