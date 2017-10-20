import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LeadService } from '../../model/services/lead.service';
import { ClientService } from '../../model/services/client.service';
import { JobService } from '../../model/services/job.service';
import { QuoteService } from '../../model/services/quote.service';

@Component({
	selector: 'app-leads',
	templateUrl: './leads.component.html',
	styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit, OnChanges {

	@Input() leadData: any;
	@Input() staff: any;

	@Output() eventUpdateLead = new EventEmitter();
	@Output() eventCreateLead = new EventEmitter();
	@Output() eventCreateFollowUp = new EventEmitter();

	jobActions = [
		{ label: 'Tender', value: 'tender' },
		{ label: 'Charge Out', value: 'chargeOut' },
		{ label: 'Quote', value: 'quote' }
	];

	jobTypes = [
		{ label: 'Developer', value: 'developer' },
		{ label: 'Commercial Builder', value: 'commercialBuilder' },
		{ label: 'Residential Builder', value: 'residentialBuilder' },
		{ label: 'Property Owner', value: 'propertyOwner' },
	];

	builderSubtypes = [
		{ label: 'Landscape Contractors', value: 'landscape' },
		{ label: 'Consultants', value: 'consultants' },
		{ label: 'Regional Authority', value: 'regionalAuthority' },
		{ label: 'Local Authority', value: 'localAuthority' }
	];

	leadForm: FormGroup;
	followUpForm: FormGroup;
	selectedLead: {
		name: 'LeadName'
	};

	clients: any[];
	followUps: any[] = [];

	constructor(private fb: FormBuilder, private leadService: LeadService, private clientService: ClientService,
		private quoteService: QuoteService, private jobService: JobService) {
		this.leadForm = fb.group({
			action: [''],
			type: [''],
			subtype: [''],
			name: [''],
			description: [''],
			clientId: [null]
		});
		this.followUpForm = fb.group({
			date: [''],
			description: [''],
			staff: ['']
		});
	}

	ngOnInit() {
		this.clientService.getClients().then(clients => {
			this.clients = clients.map(client => {
				return {
					label: client.name,
					value: client.clientId
				};
			});
		});
	}

	ngOnChanges() {
		if (this.leadData) {
			console.log('leadData', this.leadData);
			this.leadForm.patchValue({
				name: this.leadData.leadName,
				action: this.leadData.action,
				description: this.leadData.leadDescription,
				type: this.leadData.type
			});
			this.leadForm.markAsTouched();
		}
	}

	createLead() {
		// Makes new lead and new quote, new job
		this.leadService.createLead(Object.assign(this.leadForm.value, { leadStage: 1 })).then(res => {
			this.quoteService.createQuote({ leadId: res.insertId }).then(res1 => {
				this.jobService.createJob({ quoteId: res1.insertId, leadId: res.insertId }).then(res2 => {
					this.eventCreateLead.emit();
				});
			});
		});
	}

	updateLead() {
		this.leadService.updateLead(this.leadData.leadId, this.leadForm.value).then(res => {
			this.eventUpdateLead.emit(Object.assign(this.leadForm.value, { leadId: this.leadData.leadId }));
		});
	}

	createFollowUp() {
		console.log('follow up value', this.followUpForm.value)
		this.followUpForm.value.staffId = this.followUpForm.value.staff.staffId;
		delete this.followUpForm.value.staff;

		this.jobService.createFollowUp(this.leadData.leadId, this.followUpForm.value)
			.then(res => {
				this.followUps.push(this.followUpForm.value);
				this.eventCreateFollowUp.emit();
			});
	}
}
