import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRegistryContentComponent } from './header-registry-content.component';
import { TestingModule } from '../../../test/testing.module';

describe('HeaderRegistryContentComponent', () => {
  let component: HeaderRegistryContentComponent;
  let fixture: ComponentFixture<HeaderRegistryContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderRegistryContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
