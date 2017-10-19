import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
	ListboxModule, DataTableModule, SharedModule, DialogModule, InputTextModule,
	ButtonModule, TabViewModule, GrowlModule
} from 'primeng/primeng';

import { QuoteComponent } from './quote-component/quote.component';
import { QuoteModuleComponent } from './quote-module.component';
import { QuoteService } from '../model/services/quote.service';
import { JobDetailsComponent } from './job-details/job-details.component';
import { MessageService } from 'primeng/components/common/messageservice';

@NgModule({
	imports: [
		CommonModule,
		ListboxModule,
		GrowlModule,
		InputTextModule,
		ButtonModule,
		DataTableModule,
		SharedModule,
		FormsModule,
		DialogModule,
		ReactiveFormsModule,
		TabViewModule
	],
	declarations: [
		QuoteComponent,
		QuoteModuleComponent,
		JobDetailsComponent
	],
	providers: [
		QuoteService,
		MessageService
	],
	exports: [
		QuoteModuleComponent
	]
})
export class QuotingModule { }
