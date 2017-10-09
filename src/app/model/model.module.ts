import { NgModule } from '@angular/core';
import { TaskService } from './services/task.service';
import { EquipmentService } from './services/equipment.service';
import { StaffService } from './services/staff.service';
import { JobService } from './services/job.service';
import { LeadService } from './services/lead.service';
import { ClientService } from './services/client.service';
import { EpicDbDatasource, REST_URL } from './datasources/epic-db.datasource';
import { HttpModule } from '@angular/http';

@NgModule({
	imports: [HttpModule],
	providers: [LeadService, TaskService, EquipmentService, StaffService, JobService, EpicDbDatasource,
		ClientService,
		{ provide: REST_URL, useValue: `http://${location.hostname}:3000` }]
})
export class ModelModule {

}
