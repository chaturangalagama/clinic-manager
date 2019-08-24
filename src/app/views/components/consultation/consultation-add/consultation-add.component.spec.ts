import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationAddComponent } from './consultation-add.component';
import { TestingModule } from '../../../../test/testing.module';
import { ConsultationModule } from '../consultation.module';

describe('ConsultationAddComponent', () => {
  let component: ConsultationAddComponent;
  let fixture: ComponentFixture<ConsultationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, ConsultationModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
