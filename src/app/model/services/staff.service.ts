import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Staff } from '../interfaces/staff.interface';
import { EpicDbDatasource } from '../datasources/epic-db.datasource';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class StaffService {

	staff: Staff[];

	constructor(private datasource: EpicDbDatasource) {	}

	getStaff(): Promise<Staff[]> {
		return this.datasource.getData('read/Staff')
			.then( res => {
				const data: Staff[] = [];
				res.forEach(element => {
					element.value = element.staffId;
					element.label = `${element.firstName} ${element.lastName}`;
					data.push(element);
				});
				return data;
			});
	}

	assignStaff(jobId: number, staffId: number) {
		
	}

}
