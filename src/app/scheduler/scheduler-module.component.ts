import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-scheduler-module',
	templateUrl: 'scheduler-module.component.html',
})
export class SchedulerModuleComponent  implements OnInit {

	schedulerMode = 'staff';
	schedulerOptions = [];

	ngOnInit() {
		this.schedulerOptions = [
			{label: 'Staff', value: 'staff'},
			{label: 'Tasks', value: 'tasks'}
		];
	}



}
