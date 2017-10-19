import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LeadService } from '../../model/services/lead.service';
import { JobService } from '../../model/services/job.service';
import { QuoteService } from '../../model/services/quote.service';

@Component({
	selector: 'app-current-items',
	templateUrl: './current-items.component.html',
	styleUrls: ['./current-items.component.css']
})
export class CurrentItemsComponent implements OnInit {

	currentQuotes: any[];
	currentJobs: any[];
	currentLeads: any[];

	selectedLead: any;
	selectedQuote: any;
	selectedJob: any;

	// The values emitted upon selection
	@Output() quoteData = new EventEmitter();
	@Output() leadData = new EventEmitter();
	@Output() jobData = new EventEmitter();

	constructor(
		private leadService: LeadService,
		private jobService: JobService,
		private quoteService: QuoteService
	) { }

	ngOnInit() {
		this.jobService.getJobs().then(jobs => this.currentJobs = jobs.map(job => {
			return { label: job.title, value: job };
		}));

		this.quoteService.getQuotes().then(quotes => this.currentQuotes = quotes.map(quote => {
			return { label: quote.quoteId, value: quote };
		}));

		this.leadService.getLeads().then(leads => this.currentLeads = leads.map(lead => {
			return { label: lead.leadName, value: lead };
		}));
	}

	/*selectItem(type: string, value: any) {
		const types = ['job', 'quote', 'leads'];
		const properties = [this.jobData, this.quoteData, this.leadData];
		let curr = [this.currentJobs, this.currentQuotes, this.currentLeads];

		let a = properties.splice(types.indexOf(type), 1);
		curr.splice(types.indexOf(type), 1);
		a = value;
		console.log(curr, properties);
		for (var index = 0; index < properties.length; index++) {
			let prop = properties[index];
			prop.emit(curr[index].filter(x => {
				if (x.value.leadId === value.leadId) {
					return x.value;
				}
			}));
		}
	}*/

	selectLead(lead: any) {
		this.selectedQuote = null;
		this.selectedJob = null;
		// Get the quote and job information associated with that lead
		this.jobData.emit(this.currentJobs.filter(job => {
			if (job.value.leadId === lead.leadId) {
				return job.value;
			}
		})[0].value);
		this.quoteData.emit(this.currentQuotes.filter(quote => {
			if (quote.value.leadId === lead.leadId) {
				return quote.value;
			}
		})[0].value);
		this.leadData.emit(lead);

	}

	selectJob(job: any) {
		this.selectedLead = null;
		this.selectedQuote = null;
		this.leadData.emit(this.currentLeads.filter(lead => {
			if (lead.value.leadId === job.leadId) {
				return lead.value;
			}
		})[0].value);
		this.quoteData.emit(this.currentQuotes.filter(quote => {
			if (quote.value.leadId === job.leadId) {
				return quote.value;
			}
		})[0].value);
		this.jobData.emit(job);
	}

	selectQuote(quote: any) {
		this.selectedJob = null;
		this.selectedLead = null;
		this.jobData.emit(this.currentJobs.filter(job => {
			if (job.value.leadId === quote.leadId) {
				return job.value;
			}
		})[0].value);
		this.leadData.emit(this.currentLeads.filter(lead => {
			if (lead.value.leadId === quote.leadId) {
				return lead.value;
			}
		})[0].value);
		this.quoteData.emit(quote);
	}

}
