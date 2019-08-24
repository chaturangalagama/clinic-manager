import { AppConfigFile } from '../objects/AppConfigFile';
import { AppConfigService } from '../services/app-config.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigServiceSpy {
  constructor(private appConfigService: AppConfigService) {
    spyOn(appConfigService, 'getConfig').and.returnValue(new AppConfigFile());
  }
}
