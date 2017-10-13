import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {

	mainMenu = [];

	ngOnInit() {
		this.mainMenu = [
			{ label: 'Task Scheduler', routerLink: 'scheduler' },
			{ label: 'Staff Scheduler', routerLink: 'staff-scheduler' },
			{ label: 'Leads', routerLink: 'crm' }
		];
	}
}
