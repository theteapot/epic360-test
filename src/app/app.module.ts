import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TabMenuModule, MenuItem } from 'primeng/primeng';

import { SchedulerModule } from './scheduler/scheduler.module';
import { CrmModule } from './crm/crm.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		AppRoutingModule,
		CrmModule,
		SchedulerModule,
		TabMenuModule,
		BrowserModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
