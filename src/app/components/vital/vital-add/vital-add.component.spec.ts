import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalAddComponent } from './vital-add.component';

describe('VitalAddComponent', () => {
  let component: VitalAddComponent;
  let fixture: ComponentFixture<VitalAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
