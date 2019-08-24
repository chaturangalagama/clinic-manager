import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormContainerComponent } from './dynamic-form-container.component';
import { TestingModule } from '../../test/testing.module';
import { FormControlService } from '../../services/form-control.service';
import { FormBase } from '../../model/FormBase';

describe('DynamicFormContainerComponent', () => {
  let component: DynamicFormContainerComponent;
  let fixture: ComponentFixture<DynamicFormContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [DynamicFormContainerComponent],
      providers: [FormControlService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormContainerComponent);
    component = fixture.componentInstance;
    component.question = new FormBase()
    component.form = fixture.debugElement.injector.get(FormControlService).toFormGroup([component.question]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
