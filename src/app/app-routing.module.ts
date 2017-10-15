import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerModuleComponent } from './scheduler/scheduler-module.component';
import { SchedulerComponent } from './scheduler/task-scheduler/scheduler.component';
import { StaffSchedulerComponent } from './scheduler/staff-scheduler/staff-scheduler.component';
import { CrmComponent } from './crm/crm.component';

const appRoutes: Routes = [
	{ path: 'scheduler', component: SchedulerModuleComponent },
	{ path: 'crm', component: CrmComponent },
	{ path: '', redirectTo: '/scheduler', pathMatch: 'full' },
	{ path: '**', component: CrmComponent }
];

@NgModule({
	imports: [
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: true } // <-- debugging purposes only
		)
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
