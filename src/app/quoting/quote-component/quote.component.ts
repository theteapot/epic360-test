import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { QuoteService } from '../../model/services/quote.service';
import { LeadService } from '../../model/services/lead.service';
import { ClientService } from '../../model/services/client.service';

import { Message, SelectItem } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
	selector: 'app-quote-component',
	templateUrl: './quote.component.html',
	styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {

	msgs: Message[] = [];

	quoteId: number;
	quotes: any;
	leads: any;
	selectedLead: any;
	quote: Observable<any>;

	selectedQuote: any; // The quote selected on the sidebar
	quoteRows: any[]; // All of the rows for the selected quote

	selectedRow: any; // The row the user clicks on in the table
	displayDialog: boolean;
	newEntry: boolean; // Whether the user is creating or updating a row

	constructor(
		private route: ActivatedRoute,
		private quoteService: QuoteService,
		private leadService: LeadService,
		private clientService: ClientService,
		private messageService: MessageService
	) {
		this.leadService.getLeads().then(leads => {
			this.leads = leads.map(lead => {
				return {
					label: lead.leadName,
					value: lead
				};
			});
		});
		this.quoteService.getQuotes().then(quotes => {
			this.quotes = quotes.map(quote => {
				return {
					label: quote.quoteId,
					value: quote
				};
			});
		});
	}

	ngOnInit() {

	}

	downloadPdf() {
		this.messageService.add({
			severity: 'info',
			summary: 'Creating PDF',
			detail: 'The PDF will open shortly, please be patient'
		});

		this.quoteService.getPdf(this.selectedLead.quoteId)
			.then(pdf => {
				console.log('pdf string', pdf);
				const fileUrl = URL.createObjectURL(pdf);
				window.open(fileUrl);
			});
	}

	selectLead(lead: any) {
		this.quoteRows = null;
		if (lead.quoteId) {
			this.quoteService.getQuoteRows(lead.quoteId).then(quoteRows => this.quoteRows = quoteRows);
		}
		this.selectedLead = lead;
	}

	createQuote() {
		// Creates a quote element in the database
		this.quoteService.createQuote({ leadId: this.selectedLead.leadId })
			.then(res => {
				this.selectedLead.quoteId = res.insertId;
				this.quoteRows = [];
			});
		// Sends an email to the client
		this.clientService.emailClient(this.selectedLead.clientId, {
			subject: 'Quote Created - Epic360',
			text: 'We have created your quote, you should hear from us shortly.'
		}).then(() => {
			this.msgs = [];
			this.msgs.push({
				severity: 'info',
				summary: 'Email sent',
				detail: 'An email has been sent to this client confirming a quote has been created'
			});
		});
	}


	onRowSelect(event) {
		this.newEntry = false;
		this.selectedRow = event.data;
		console.log(this.selectedRow);
		this.displayDialog = true;
	}

	showDialogToAdd() {
		this.newEntry = true;
		this.selectedRow = {
			description: '',
			amount: '',
			cost: '',
			quoteId: this.selectedLead.quoteId,
		};
		this.displayDialog = true;
	}

	save() {
		console.log('entry', this.newEntry);
		const rows = [... this.quoteRows];
		if (this.newEntry) {
			console.log('selectedRow', this.selectedRow);
			this.quoteService.createQuoteRow(this.selectedRow).then(response => {
				const index = this.quoteRows.findIndex(quote => quote === this.selectedRow);
				this.quoteRows[index].quoteRowId = response.insertId;
				console.log('selectedRow', this.quoteRows);
			});
			rows.push(this.selectedRow);
		} else {
			const index = this.quoteRows.findIndex(quote => quote === this.selectedRow);
			rows[index] = this.selectedRow;
			this.quoteService.updateQuoteRow(this.selectedRow);
		}
		this.quoteRows = rows;
		this.displayDialog = false;
	}

	delete() {
		const index = this.quoteRows.findIndex(quote => quote === this.selectedRow);
		this.quoteRows = this.quoteRows.filter((val, i) => i !== index);
		this.quoteService.deleteQuoteRow(this.selectedRow);
		this.selectedRow = null;
		this.displayDialog = false;
	}

}
