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
			{ label: 'Scheduler', routerLink: 'scheduler' },
			{ label: 'Leads', routerLink: 'crm' },
			{ label: 'Quotes', routerLink: 'quoting'}
		];
	}
}
