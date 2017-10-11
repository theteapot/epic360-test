import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SchedulerComponent } from './scheduler/scheduler.component';
import { CrmComponent } from './crm/crm.component';

const appRoutes: Routes = [
	{ path: 'scheduler', component: SchedulerComponent },
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
