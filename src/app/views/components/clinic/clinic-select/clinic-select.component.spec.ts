import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicSelectComponent } from './clinic-select.component';
import { TestingModule } from '../../../../test/testing.module';
import { StoreService } from '../../../../services/store.service';

describe('ClinicSelectComponent', () => {
  let component: ClinicSelectComponent;
  let fixture: ComponentFixture<ClinicSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
