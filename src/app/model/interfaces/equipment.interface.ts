import { SelectItem } from 'primeng/primeng';

export interface Equipment extends SelectItem {
	equipmentId: number;
	workType: number;
	kilometers: number;
	hours: number;
	equipmentType: string;
	registration: string;
}
