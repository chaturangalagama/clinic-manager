import { AssignMedicalCoverageComponent } from './assign-medical-coverage.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../test/testing.module';

describe('AssignMedicalCoverageComponent', () => {
  let component: AssignMedicalCoverageComponent;
  let fixture: ComponentFixture<AssignMedicalCoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMedicalCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
