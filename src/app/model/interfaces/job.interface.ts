import { SelectItem } from 'primeng/primeng';

export interface Job extends SelectItem {
	jobId: number;
	clientId: number;
	description: string;
	jobTypeId: number;
	type: string;
	title: string;
	status: string;

	// Lead related info
	estValue: number;
	origin: string;

	// Address info
	street: string;
	suburb: string;
	city: string;

	start: any; // These should be moment objects
	end: any; // These should be moment objects
}
