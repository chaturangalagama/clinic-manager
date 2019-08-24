import { environment } from './../../environments/environment';
import { AppConfigFile } from './../objects/AppConfigFile';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigService {
  private appConfig: AppConfigFile;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    console.log('API PATH', environment.apiPath);
    this.appConfig = <AppConfigFile>environment.apiPath;
    return new Promise((resolve, reject) => {
      if (this.appConfig) {
        resolve(true);
      }
      resolve(false);
    });
  }

  getConfig(): AppConfigFile {
    return this.appConfig;
  }
}
