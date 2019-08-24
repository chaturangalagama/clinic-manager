import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import './scss/style.scss';

if (environment.production) {
    enableProdMode();
    // Disable console log
    if (window) {
        window.console.log = function() {};
    }
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));
