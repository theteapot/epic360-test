import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Job } from '../interfaces/job.interface';
import { JobType } from '../interfaces/job-type.interface';
import { EpicDbDatasource } from '../datasources/epic-db.datasource';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

@Injectable()
export class JobService {

	constructor(private datasource: EpicDbDatasource) { }

	getJobs(): Promise<Job[]> {
		return this.datasource.getData('read/JobView')
			.then(res => {
				const data: Job[] = [];
				res.forEach(element => {
					element.value = element;
					element.label = element.title;
					// Creating date objects from mysql DATETIME strings
					element.start = moment(element.start);
					element.end = moment(element.end);
					data.push(element);
				});
				console.log(data);
				return data;
			});
	}

	getJob(column: string, parameter: string): Promise<any> {
		return this.datasource.getData(`read/JobView/${column}/${parameter}`)
			.then(res => {
				// Only return the first element of the array since we only expect one
				return res[0];
			});
	}

	getSiteVisits(jobId?: number): Promise<any[]> {
		if (jobId) {
			return this.datasource.getData(`read/SiteVisitView/jobId/${jobId}`);
		} else {
			return this.datasource.getData(`read/SiteVisitView`);
		}
		
	}

	getSiteVisitPictures(siteVisitId: number): Promise<{ data: string, description: string }[]> {
		return this.datasource.getData(`picture/siteVisitid/${siteVisitId}`);
	}

	getFollowUps(jobId?: number): Promise<any[]> {
		if (jobId) {
			return this.datasource.getData(`read/FollowUpView/jobId/${jobId}`);
		} else {
			return this.datasource.getData(`read/FollowUpView`);
		}
	}

	changeStatus(jobId: number, status: string): Promise<any> {
		return this.datasource.putData(`update/Job/jobId/${jobId}`, { status: status })
			.then(res => {
				console.log('status changed');
			});
	}


	getJobTemplates(): Promise<Job[]> {
		return this.datasource.getData('read/JobTemplate')
			.then(res => {
				const data: Job[] = [];
				res.forEach(element => {
					element.value = element.jobId;
					element.label = `${element.type}: ${element.description}`;
					data.push(element);
				});
				return data;
			});
	}

	getJobTypes(): Promise<JobType[]> {
		return this.datasource.getData('read/JobType')
			.then(res => {
				const data: JobType[] = [];
				res.forEach(element => {
					element.value = element.jobTypeId;
					element.label = `${element.type}`;
					data.push(element);
				});
				return data;
			});
	}

	createJob(job: Job): Promise<any> {
		// Transform job start/end into mySql DATETIME strings
		return this.datasource.postData('create/Job', job);
	}

	createFollowUp(leadId: number, followUpData: any) {
		followUpData.leadId = leadId;
		return this.datasource.postData('create/FollowUp', followUpData);
	}

	createSiteVisit(jobId: number, siteVisitData: any) {
		siteVisitData.jobId = jobId;
		return this.datasource.postData('create/SiteVisit', siteVisitData);
	}

	updateJob(jobId: number, update): Promise<any> {
		return this.datasource.putData(`update/Job/jobId/${jobId}`, update)
			.then(res => {
				console.log(res);
			});
	}
}
