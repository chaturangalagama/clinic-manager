import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleErrorComponent } from './simple-error.component';
import { TestingModule } from '../../../test/testing.module';

describe('SimpleErrorComponent', () => {
  let component: SimpleErrorComponent;
  let fixture: ComponentFixture<SimpleErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleErrorComponent);
    component = fixture.componentInstance;
    component.errors = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
