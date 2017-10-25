import { SelectItem } from 'primeng/primeng';
import { Event } from './event.interface';

export interface Task {
	taskId?: number;
	staffId?: number;
	jobId: number;
	equipmentId?: number;
	header?: string;
	description?: string;
	start?: any;
	end?: any;
	firstName?: string;
	lastName?: string;
	registration?: string;
	workType?: number;
	status?: string;
}
