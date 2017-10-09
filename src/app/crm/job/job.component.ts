import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JobService } from '../../model/services/job.service';
import { StaffService } from '../../model/services/staff.service';
import { TaskService } from '../../model/services/task.service';
import { JobType } from '../../model/interfaces/job-type.interface';
import { Job } from '../../model/interfaces/job.interface';
import { Staff } from '../../model/interfaces/staff.interface';

@Component({
	selector: 'app-job',
	templateUrl: './job.component.html',
	styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

	jobForm: FormGroup;
	followUpForm: FormGroup;
	siteVisitForm: FormGroup;

	@Input() client;
	selectedJob: Job;

	jobTypes: JobType[];
	staff: Staff[];
	jobs: Job[];
	followUps: any[];
	siteVisits: any[];

	showJobForm: boolean;

	originOptions = [
		{ label: 'Web', value: 'web' },
		{ label: 'Signage', value: 'signage' },
		{ label: 'Yellow Pages', value: 'yellowPages' },
		{ label: 'Word of Mouth', value: 'mouth' },
	];

	constructor(private fb: FormBuilder, private jobService: JobService, private staffService: StaffService,
		private taskService: TaskService) {
		this.jobForm = fb.group({
			title: [''],
			jobTypeId: [''],
			description: [''],
			estValue: [''],
			origin: [''],
			street: [''],
			suburb: [''],
			city: [''],
			dateRange: ['']
		});

		this.followUpForm = fb.group({
			date: [''],
			description: [''],
			staff: ['']
		});

		this.siteVisitForm = fb.group({
			start: [''],
			staff: [''],
			description: [''],
		});

	}

	ngOnInit() {
		this.jobService.getJobTypes().then(jobTypes => this.jobTypes = jobTypes);
		this.staffService.getStaff().then(staff => this.staff = staff);
		this.jobService.getJobs().then(jobs => this.jobs = jobs);
	}

	getJobDetails(event) {
		console.log(event);
		// Gets the follow ups and site visits for a job
		this.jobService.getFollowUps(event.value.jobId)
			.then(followUps => this.followUps = followUps);
		this.jobService.getSiteVisits(event.value.jobId)
			.then(siteVisits => this.siteVisits = siteVisits);
	}

	createJob() {
		this.jobForm.value.start = this.jobForm.value.dateRange[0];
		this.jobForm.value.end = this.jobForm.value.dateRange[1];
		delete this.jobForm.value.dateRange;

		this.jobService.createJob(this.jobForm.value);
	}

	createFollowUp() {
		this.followUpForm.value.staffId = this.followUpForm.value.staff.staffId;
		delete this.followUpForm.value.staff;

		this.jobService.createFollowUp(this.selectedJob.jobId, this.followUpForm.value)
			.then(res => {
				this.followUps.push(this.followUpForm.value);
			});
	}

	createSiteVisit() {
		this.siteVisitForm.value.staffId = this.siteVisitForm.value.staff.staffId;
		delete this.siteVisitForm.value.staff;

		this.siteVisitForm.value.street = this.selectedJob.street;
		this.siteVisitForm.value.suburb = this.selectedJob.suburb;
		this.siteVisitForm.value.city = this.selectedJob.city;

		this.jobService.createSiteVisit(this.selectedJob.jobId, this.siteVisitForm.value)
			.then(res => {
				this.followUps.push(this.siteVisitForm.value);
			});
	}

}
