import { Component } from '@angular/core';

@Component({
	selector: 'app-crm',
	templateUrl: './crm.component.html',
	styleUrls: ['./crm.component.css']
})
export class CrmComponent {
	constructor() { }
	quoteData: any;
	leadData: any;
	jobData: any;

	handleQuoteData(data) {
		this.quoteData = data;
	}

	handleLeadData(data) {
		this.leadData = data;
	}

	handleJobData(data) {
		this.jobData = data;
	}
}
