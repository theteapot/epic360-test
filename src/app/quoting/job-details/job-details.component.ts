import { Component, OnChanges, Input } from '@angular/core';
import { JobService } from '../../model/services/job.service';

@Component({
	selector: 'app-job-details',
	templateUrl: './job-details.component.html',
	styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnChanges {

	@Input() selectedQuote: any;
	job: any = null;

	constructor(private jobService: JobService) { }

	ngOnChanges() {
		if (this.selectedQuote) {
			this.jobService.getJob(this.selectedQuote.jobId).then(job => this.job = job);
		}
	}

}
