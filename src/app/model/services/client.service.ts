import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { EpicDbDatasource } from '../datasources/epic-db.datasource';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class ClientService {

	constructor(private datasource: EpicDbDatasource) { }

	createClient(clientData: any): Promise<any[]> {
		return this.datasource.postData('create/Client', clientData);
	}

	createOffice(clientId: number, officeData: any) {
		officeData.clientId = clientId;
		return this.datasource.postData('create/ClientOffice', officeData);
	}

	createContact(clientId: number, clientData: any) {
		clientData.clientId = clientId;
		return this.datasource.postData('create/ClientContact', clientData);
	}

	getClients(): Promise<any[]> {
		return this.datasource.getData('read/Client');
	}

	getContacts(): Promise<any[]> {
		return this.datasource.getData('read/ClientContact');
	}

	getOffices(): Promise<any[]> {
		return this.datasource.getData('read/ClientOffice');
	}
}
