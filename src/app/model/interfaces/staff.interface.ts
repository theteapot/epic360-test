import { SelectItem } from 'primeng/primeng';

export interface Staff extends SelectItem {
	staffId: number;
	firstName: string;
	lastName: string;
	workType: number;
}
