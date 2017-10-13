import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulerComponent } from './task-scheduler/scheduler.component';
import { StagingAreaComponent } from './staging-area/staging-area.component';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import {
	TabViewModule, DataListModule, DialogModule, ButtonModule, DropdownModule, SelectButtonModule,
	PanelModule, CalendarModule
} from 'primeng/primeng';
import { ModelModule } from '../model/model.module';
import { CrmModule } from '../crm/crm.module';
import { StaffSchedulerComponent } from './staff-scheduler/staff-scheduler.component';

@NgModule({
	declarations: [
		SchedulerComponent,
		StagingAreaComponent,
		StaffSchedulerComponent
	],
	imports: [
		ModelModule,
		CrmModule,
		TabViewModule,
		CalendarModule,
		PanelModule,
		SelectButtonModule,
		DataListModule,
		TabViewModule,
		CommonModule,
		DragulaModule,
		DialogModule,
		ButtonModule,
		DropdownModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [
		SchedulerComponent,
		StaffSchedulerComponent
	],
	providers: [],
	bootstrap: []
})
export class SchedulerModule { }
