import { SelectItem } from 'primeng/primeng';

export interface JobType extends SelectItem {
	type: string;
	jobTypeId: number;
}