import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalAddItemComponent } from './vital-add-item.component';

describe('VitalAddItemComponent', () => {
  let component: VitalAddItemComponent;
  let fixture: ComponentFixture<VitalAddItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalAddItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalAddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
