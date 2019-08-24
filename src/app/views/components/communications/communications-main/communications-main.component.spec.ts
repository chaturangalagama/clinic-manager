import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationsMainComponent } from './communications-main.component';
import { TestingModule } from '../../../../test/testing.module';

describe('CommunicationsMainComponent', () => {
  let component: CommunicationsMainComponent;
  let fixture: ComponentFixture<CommunicationsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CommunicationsMainComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
