import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	TabViewModule, DataListModule, DialogModule, ButtonModule, DropdownModule, SelectButtonModule,
	PanelModule, CalendarModule, FieldsetModule, CarouselModule
} from 'primeng/primeng';
import { ModelModule } from '../model/model.module';
import { LeadsComponent } from '../crm/leads/leads.component';
import { ClientsComponent } from '../crm/clients/clients.component';
import { SiteVisitComponent } from '../crm/site-visit/site-visit.component';
import { JobComponent } from '../crm/job/job.component';
import { CrmComponent } from './crm.component';

@NgModule({
	declarations: [
		ClientsComponent,
		SiteVisitComponent,
		JobComponent,
		LeadsComponent,
		CrmComponent
	],
	imports: [
		DataListModule,
		ButtonModule,
		DropdownModule,
		PanelModule,
		CalendarModule,
		FieldsetModule,
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
