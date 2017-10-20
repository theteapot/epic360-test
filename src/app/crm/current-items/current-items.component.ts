import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { LeadService } from '../../model/services/lead.service';
import { JobService } from '../../model/services/job.service';
import { QuoteService } from '../../model/services/quote.service';

@Component({
	selector: 'app-current-items',
	templateUrl: './current-items.component.html',
	styleUrls: ['./current-items.component.css']
})
export class CurrentItemsComponent implements OnInit {

	@Input() currentQuotes: any[];
	@Input() currentJobs: any[];
	@Input() currentLeads: any[];

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

	}

	selectLead(lead: any) {
		this.selectedQuote = null;
		this.selectedJob = null;
		// Get the quote and job information associated with that lead
		this.jobData.emit(null);
		this.quoteData.emit(null);
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
		this.jobData.emit(null);
		this.leadData.emit(this.currentLeads.filter(lead => {
			if (lead.value.leadId === quote.leadId) {
				return lead.value;
			}
		})[0].value);
		this.quoteData.emit(quote);
	}

}
