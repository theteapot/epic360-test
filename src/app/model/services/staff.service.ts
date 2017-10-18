import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Staff } from '../interfaces/staff.interface';
import { MySQLResponse } from '../interfaces/mysql-response.interface';
import { EpicDbDatasource } from '../datasources/epic-db.datasource';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

@Injectable()
export class StaffService {

	staff: Staff[];

	constructor(private datasource: EpicDbDatasource) {	}

	getStaff(): Promise<Staff[]> {
		return this.datasource.getData('read/Staff')
			.then( res => {
				const data: Staff[] = [];
				res.forEach(element => {
					element.value = element;
					element.label = `${element.firstName} ${element.lastName}`;
					data.push(element);
				});
				return data;
			});
	}

	getStaffPlaceholders(): Promise<any> {
		return this.datasource.getData('read/StaffPlaceholderView')
		.then( res => {
			res.forEach(placeholder => {
				placeholder['start'] = placeholder.start ? moment(placeholder.start) : null;
				placeholder['end'] = placeholder.start ? moment(placeholder.end) : null;
			});
			console.log('res', res);
			return res;
		});
	}

	createStaffPlaceholder(placeholder: any): Promise<MySQLResponse> {
		// Creating a staff placeholder entry
		return this.datasource.postData(`create/StaffPlaceholder`, placeholder)
			.then(res => {
				return res;
			});
	}

	updateStaffPlaceholder(placeholder: any) {
		// Creating a staff placeholder entry
		placeholder.start = placeholder.start.format('YYYY-MM-DD hh:mm:ss');
		placeholder.end = placeholder.end.format('YYYY-MM-DD hh:mm:ss');
		return this.datasource.putData(`update/StaffPlaceholder/staffPlaceholderId/${placeholder.staffPlaceholderId}`, placeholder)
			.then(res => {
				console.log(res);
			});
	}

	removeStaffPlaceholder(placeholder: any) {
		return this.datasource.deleteData(`delete/StaffPlaceholder/staffPlaceholderId/${placeholder.staffPlaceholderId}`);
	}

	assignStaff(jobId: number, staffId: number) {
		return this.datasource.postData('create/StaffJobJoin', {jobId: jobId, staffId: staffId})
			.then( res => {
				console.log('job and staff');
			});
	}

	getStaffAssignment(): Promise<any> {
		// For getting the jobs staff members are assigned to
		return this.datasource.getData('read/StaffView')
			.then( res => {
				return res;
			});
	}
}
