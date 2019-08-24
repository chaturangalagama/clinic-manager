import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRegistryComponent } from './header-registry.component';
import { TestingModule } from '../../test/testing.module';

describe('HeaderRegistryComponent', () => {
  let component: HeaderRegistryComponent;
  let fixture: ComponentFixture<HeaderRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
