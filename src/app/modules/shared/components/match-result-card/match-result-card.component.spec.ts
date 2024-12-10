import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchResultCardComponent } from './match-result-card.component';

describe('MatchResultCardComponent', () => {
  let component: MatchResultCardComponent;
  let fixture: ComponentFixture<MatchResultCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchResultCardComponent]
    });
    fixture = TestBed.createComponent(MatchResultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
