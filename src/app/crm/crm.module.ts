import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	TabViewModule, DataListModule, DialogModule, ButtonModule, DropdownModule, SelectButtonModule,
	PanelModule, CalendarModule
} from 'primeng/primeng';
import { ModelModule } from '../model/model.module';
import { LeadsComponent } from '../crm/leads/leads.component';
import { ClientsComponent } from '../crm/clients/clients.component';
import { JobComponent } from '../crm/job/job.component';
import { CrmComponent } from './crm.component';

@NgModule({
	declarations: [
		ClientsComponent,
		JobComponent,
		LeadsComponent,
		CrmComponent
	],
	imports: [
		DataListModule,
		ButtonModule,
		DropdownModule,
		CalendarModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
	],
	exports: [
		CrmComponent
	]
})
export class CrmModule { }
