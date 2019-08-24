import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalContainerComponent } from './vital-container.component';

describe('VitalContainerComponent', () => {
  let component: VitalContainerComponent;
  let fixture: ComponentFixture<VitalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
