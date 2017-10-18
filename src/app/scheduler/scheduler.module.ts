import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulerComponent } from './task-scheduler/scheduler.component';
import { StagingAreaComponent } from './staging-area/staging-area.component';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import {
	TabViewModule, DataListModule, DialogModule, ButtonModule, DropdownModule, SelectButtonModule,
	PanelModule, CalendarModule, CheckboxModule, GrowlModule, MultiSelectModule
} from 'primeng/primeng';
import {MessageService} from 'primeng/components/common/messageservice';
import { ModelModule } from '../model/model.module';
import { CrmModule } from '../crm/crm.module';
import { StaffSchedulerComponent } from './staff-scheduler/staff-scheduler.component';
import { SchedulerModuleComponent } from './scheduler-module.component';

@NgModule({
	declarations: [
		SchedulerComponent,
		StagingAreaComponent,
		StaffSchedulerComponent,
		SchedulerModuleComponent
	],
	imports: [
		ModelModule,
		CrmModule,
		GrowlModule,
		TabViewModule,
		CalendarModule,
		PanelModule,
		SelectButtonModule,
		DataListModule,
		CheckboxModule,
		MultiSelectModule,
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
	providers: [MessageService],
	bootstrap: []
})
export class SchedulerModule { }
