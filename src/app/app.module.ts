import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TabMenuModule, MenuItem } from 'primeng/primeng';

import { SchedulerModule } from './scheduler/scheduler.module';
import { CrmModule } from './crm/crm.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { QuotingModule } from './quoting/quoting.module';
import { QuoteRoutingModule } from './quoting/quote-routing.module';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		QuoteRoutingModule,
		AppRoutingModule,
		CrmModule,
		SchedulerModule,
		QuotingModule,
		TabMenuModule,
		BrowserModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
