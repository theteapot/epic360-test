import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Equipment } from '../interfaces/equipment.interface';
import { EpicDbDatasource } from '../datasources/epic-db.datasource';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class EquipmentService {

	equipment: Equipment[];

	constructor(private datasource: EpicDbDatasource) {	}

	getEquipment(): Promise<Equipment[]> {
		return this.datasource.getData('read/Equipment')
			.then( res => {
				console.log('res', res);
				const data: Equipment[] = [];
				res.forEach(element => {
					element.value = element.equipmentId;
					element.label = element.registration;
					data.push(element);
				});
				console.log('data', data);
				return data;
			});
	}
}
