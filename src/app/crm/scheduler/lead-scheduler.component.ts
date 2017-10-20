import { Component, OnInit } from '@angular/core';
import { JobService } from '../../model/services/job.service';

import * as fullCalendar from 'fullcalendar';
declare var $: any;

@Component({
	selector: 'app-lead-scheduler',
	templateUrl: './lead-scheduler.component.html',
})
export class LeadSchedulerComponent implements OnInit {

	leadScheduler: any;
	events: any;

	constructor(private jobService: JobService) { }

	initScheduler() {
		this.leadScheduler = $('#lead-scheduler');
		this.leadScheduler.fullCalendar({
			defaultView: 'basicWeek',
			height: 300,
			resourceAreaWidth: '100px',
			events: this.events
		});
	}

	ngOnInit() {
		Promise.all([this.jobService.getFollowUps(), this.jobService.getSiteVisits()]).then(values => {
			this.events = values[0].concat(values[1]).map(event => {
				return {
					title: event.title,
					start: event.date,
					value: event,
					color: event.followUpId ? 'red' : 'blue'
				};
			});
			this.initScheduler();
		});
	}
}
