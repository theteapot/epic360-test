import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerModuleComponent } from './scheduler/scheduler-module.component';
import { StaffSchedulerComponent } from './scheduler/staff-scheduler/staff-scheduler.component';
import { CrmComponent } from './crm/crm.component';
import { QuoteModuleComponent } from './quoting/quote-module.component';

const appRoutes: Routes = [
	{ path: 'scheduler', component: SchedulerModuleComponent },
	{ path: 'crm', component: CrmComponent },
	{ path: '', redirectTo: '/scheduler', pathMatch: 'full' },
	{ path: 'quoting', component: QuoteModuleComponent },
	{ path: '**', component: SchedulerModuleComponent },

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
