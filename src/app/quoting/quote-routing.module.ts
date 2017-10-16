import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteComponent } from './quote-component/quote.component';

const quotingRoutes: Routes = [
	{
		path: 'quoting/:id',
		component: QuoteComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(quotingRoutes)
	],
	exports: [
		RouterModule
	]
})
export class QuoteRoutingModule { }
