import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLightUserModalComponent } from './create-light-user-modal.component';

describe('CreateLightUserModalComponent', () => {
  let component: CreateLightUserModalComponent;
  let fixture: ComponentFixture<CreateLightUserModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLightUserModalComponent]
    });
    fixture = TestBed.createComponent(CreateLightUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
