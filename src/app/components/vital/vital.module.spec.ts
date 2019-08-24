import { VitalModule } from './vital.module';

describe('VitalModule', () => {
  let vitalModule: VitalModule;

  beforeEach(() => {
    vitalModule = new VitalModule();
  });

  it('should create an instance', () => {
    expect(vitalModule).toBeTruthy();
  });
});
