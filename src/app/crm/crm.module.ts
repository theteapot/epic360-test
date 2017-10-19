import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	TabViewModule, DataListModule, DialogModule, ButtonModule, DropdownModule, SelectButtonModule,
	PanelModule, CalendarModule, FieldsetModule, CarouselModule, GrowlModule, DataTableModule,
	ListboxModule
} from 'primeng/primeng';
import { ModelModule } from '../model/model.module';
import { LeadsComponent } from '../crm/leads/leads.component';
import { ClientsComponent } from '../crm/clients/clients.component';
import { SiteVisitComponent } from '../crm/site-visit/site-visit.component';
import { JobComponent } from '../crm/job/job.component';
import { CrmComponent } from './crm.component';
import { QuoteComponent } from './quotes/quote.component';
import { CurrentItemsComponent } from './current-items/current-items.component';

@NgModule({
	declarations: [
		ClientsComponent,
		SiteVisitComponent,
		JobComponent,
		LeadsComponent,
		QuoteComponent,
		CrmComponent,
		CurrentItemsComponent
	],
	imports: [
		DataListModule,
		ButtonModule,
		DialogModule,
		DropdownModule,
		DataTableModule,
		GrowlModule,
		PanelModule,
		CalendarModule,
		ListboxModule,
		FieldsetModule,
		TabViewModule,
		CarouselModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
	],
	exports: [
		CrmComponent
	]
})
export class CrmModule { }
