import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteComponent } from './quote-component/quote.component';
import { QuoteModuleComponent } from './quote-module.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		QuoteComponent,
		QuoteModuleComponent
	],
	exports: [
		QuoteModuleComponent
	]
})
export class QuotingModule { }
