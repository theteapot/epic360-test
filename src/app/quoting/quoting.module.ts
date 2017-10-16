import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
	ListboxModule, DataTableModule, SharedModule, DialogModule, InputTextModule,
	ButtonModule, TabViewModule
} from 'primeng/primeng';

import { QuoteComponent } from './quote-component/quote.component';
import { QuoteModuleComponent } from './quote-module.component';
import { QuoteService } from '../model/services/quote.service';
import { JobDetailsComponent } from './job-details/job-details.component';

@NgModule({
	imports: [
		CommonModule,
		ListboxModule,
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
		QuoteService
	],
	exports: [
		QuoteModuleComponent
	]
})
export class QuotingModule { }
