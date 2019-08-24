import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugInputSearchModalComponent } from './drug-input-search-modal.component';
import { TestingModule } from '../../../test/testing.module';

describe('DrugInputSearchModalComponent', () => {
  let component: DrugInputSearchModalComponent;
  let fixture: ComponentFixture<DrugInputSearchModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugInputSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
