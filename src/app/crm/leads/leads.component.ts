import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LeadService } from '../../model/services/lead.service';

@Component({
	selector: 'app-leads',
	templateUrl: './leads.component.html',
	styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {

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
	selectedLead: {
		name: 'LeadName'
	};

	constructor(private fb: FormBuilder, private leadService: LeadService) {
		this.leadForm = fb.group({
			action: [''],
			type: [''],
			subtype: [''],
			name: [''],
			description: ['']
		});
	}

	ngOnInit() {
	}

	createLead() {
		// Make the lead row in the database
		this.leadService.createLead(this.leadForm.value);
	}
}
