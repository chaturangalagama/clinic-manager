import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingMedicationItemComponent } from './ongoing-medication-item.component';

describe('OngoingMedicationItemComponent', () => {
  let component: OngoingMedicationItemComponent;
  let fixture: ComponentFixture<OngoingMedicationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingMedicationItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingMedicationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
