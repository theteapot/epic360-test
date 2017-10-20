import { SelectItem } from 'primeng/primeng';

export interface Staff extends SelectItem {
	staffId: number;
	name: string;
	workType: number;
}
