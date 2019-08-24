import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [PagesRoutingModule, FormsModule, CommonModule, SharedModule],
  declarations: [P404Component, P500Component, LoginComponent, RegisterComponent],
  providers: [],
  entryComponents: []
})
export class PagesModule {}
