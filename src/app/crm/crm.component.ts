import { Component, OnInit } from '@angular/core';
import { LeadService } from '../model/services/lead.service';
import { JobService } from '../model/services/job.service';
import { QuoteService } from '../model/services/quote.service';
import { StaffService } from '../model/services/staff.service';

@Component({
	selector: 'app-crm',
	templateUrl: './crm.component.html',
	styleUrls: ['./crm.component.css']
})
export class CrmComponent implements OnInit {

	staff: any;

	quoteData: any;
	leadData: any;
	jobData: any;

	currentQuotes: any[];
	currentJobs: any[];
	currentLeads: any[];

	filteredLeads: any[];
	filteredQuotes: any[];
	filteredJobs: any[];

	constructor(
		private leadService: LeadService,
		private jobService: JobService,
		private quoteService: QuoteService,
		private staffService: StaffService
	) { }

	ngOnInit() {
		this.refreshJobs();
		this.refreshLeads();
		this.refreshQuotes();
		this.staffService.getStaff().then(staff => {
			this.staff = staff.map(s => {
				return {label: s.name, value: s};
			});
		});
	}

	refreshJobs() {
		this.jobService.getJobs().then(jobs => {
			this.currentJobs = jobs.map(job => {
				return { label: job.title, value: job };
			});
			this.filteredJobs = this.currentJobs.filter(j => j.value.jobStage === 1);
		});
	}

	refreshQuotes() {
		return this.quoteService.getQuotes().then(quotes => {
			this.currentQuotes = quotes.map(quote => {
				return { label: quote.quoteId, value: quote };
			});
			this.filteredQuotes = this.currentQuotes.filter(q => q.value.quoteStage === 1);
		});
	}

	refreshLeads() {
		return this.leadService.getLeads().then(leads => {
			this.currentLeads = leads.map(lead => {
				return { label: lead.leadName, value: lead };
			});
			this.filteredLeads = this.currentLeads.filter(l => l.value.leadStage === 1);
		});
	}

	handleQuoteData(data) {
		this.quoteData = data;
	}

	handleLeadData(data) {
		this.leadData = data;
	}

	handleJobData(data) {
		this.jobData = data;
	}

	handleLeadUpdate(lead: any) {
		const index = this.currentLeads.findIndex(l => l.value.leadId === lead.leadId);
		Object.assign(this.currentLeads[index].value, lead);
	}

	handleLeadCreate(lead: any) {
		this.refreshLeads();
	}

	handleLeadToQuote(quote: any) {
		// Only handles the creation/deletion of new quotes
		// Sets the leadFlag to 0 and the quoteFlag to 1
		let index = this.currentLeads.findIndex(l => l.value.leadId === quote.leadId);
		Object.assign(this.currentLeads[index].value, { leadFlag: 0 });

		index = this.currentQuotes.findIndex(q => q.value.quoteId === quote.quoteId);
		Object.assign(this.currentQuotes[index].value, { quoteFlag: 1 });

	}

	handleQuoteToJob(event: any) {
		this.jobService.getJobs().then(jobs => this.currentJobs = jobs.map(job => {
			return { label: job.title, value: job };
		}));
		this.quoteService.getQuotes().then(quotes => this.currentQuotes = quotes.map(quote => {
			return { label: quote.quoteId, value: quote };
		}));
	}

	handleQuoteCreated(event: any) {
		this.quoteService.getQuotes().then(quotes => this.currentQuotes = quotes.map(quote => {
			return { label: quote.quoteId, value: quote };
		}));
	}



}
