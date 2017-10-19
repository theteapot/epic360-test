import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { EpicDbDatasource } from '../datasources/epic-db.datasource';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class LeadService {

	constructor(private datasource: EpicDbDatasource) {	}

	createLead(leadData: any): Promise<any> {
		return this.datasource.postData('create/Lead', leadData);
	}

	updateLead(leadId: number, lead: any) {
		return this.datasource.putData(`update/Lead/leadId/${leadId}`, lead);
	}

	getLeads(): Promise<any[]> {
		return this.datasource.getData('read/LeadView');
	}

}
