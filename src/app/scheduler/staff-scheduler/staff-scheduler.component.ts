import { Component, OnInit, AfterViewInit, Input, OnChanges, AfterViewChecked } from '@angular/core';
import { StaffService } from '../../model/services/staff.service';
import { TaskService } from '../../model/services/task.service';
import { EquipmentService } from '../../model/services/equipment.service';
import { JobService } from '../../model/services/job.service';
import { Staff } from '../../model/interfaces/staff.interface';
import { Task } from '../../model/interfaces/task.interface';
import { Equipment } from '../../model/interfaces/equipment.interface';
import { MySQLResponse } from '../../model/interfaces/mysql-response.interface';

import { Job } from '../../model/interfaces/job.interface';


import * as sha1 from 'sha1';
import * as fullCalendar from 'fullcalendar';

declare var $: any;

@Component({
	selector: 'app-staff-scheduler',
	templateUrl: './staff-scheduler.component.html',
	styleUrls: ['./staff-scheduler.component.css']
})
export class StaffSchedulerComponent implements OnInit {

	staffScheduler: any;
	jobs: any;
	resources: { id: number, title: string, type: string }[] = [];
	events: { staffId: any, title?: string, start: any, end?: string, rendering?: string, resourceId: number, placeholderId?: number }[] = [];

	constructor(private jobService: JobService, private staffService: StaffService,
		private taskService: TaskService) {
	}

	ngOnInit() {
		const jobPromise = this.jobService.getJobs()
			.then(jobs => {
				for (let job of jobs) {
					if (job.status === 'active') {
						this.resources.push({
							id: job.jobId,
							title: job.title,
							type: 'job'
						});
						this.events.push({
							staffId: job.jobId,
							title: job.title,
							start: job.start,
							end: job.end,
							resourceId: job.jobId,
							rendering: 'background'
						});
					}
				}
			});

		const staffPlaceholderPromise = this.staffService.getStaffPlaceholders()
			.then(placeholders => {
				for (let event of placeholders) {
					this.events.push({
						staffId: event.staffId,
						start: event.start,
						end: event.end,
						title: event.staffId,
						resourceId: event.jobId,
						placeholderId: event.staffPlaceholderId
					});
				}
			});

		Promise.all([jobPromise, staffPlaceholderPromise]).then(res => {
			this.createScheduler();
		});
	}

	createScheduler(): any {
		console.log('creating staffScheduler', this.resources, this.events);
		this.staffScheduler = $('#staff-scheduler');
		this.staffScheduler.fullCalendar({
			header: {
				center: 'timeline, timelineMonth'
			},
			defaultView: 'timeline',
			visibleRange: (currentDate) => {
				return {
					start: currentDate.clone().subtract(10, 'days'),
					end: currentDate.clone().add(30, 'days')
				};
			},
			slotLabelFormat: [
				'DD/MM'
			],
			eventResourceEditable: true,
			editable: true,
			droppable: true,
			drop: (date, jsEvent, ui, resourceId) => {
				this.handleDrop(date, jsEvent, ui, resourceId);
			},
			slotwidth: 100,
			eventoverlap: false,
			eventRender: (event, element) => {
			},
			dropAccept: this.schedulerAccept,
			eventReceive: event => {
				this.handleRecieveEvent(event);
			},
			eventResize: (event, delta, revertFunc, ui, view) => {
				this.handleEventResize(event, delta, revertFunc, ui, view);
			},
			eventDrop: (event, delta, jsEvent, revertFunc, ui, view) => {
				this.handleEventDrop(event, delta, jsEvent, revertFunc, ui, view);
			},
			resourceRender: (res, label, body) => {
			},
			events: this.events,
			resources: this.resources
		});
	}

	handleDrop(date, jsEvent, ui, resourceId) {
		console.log('jobId', resourceId, 'staffId', $(jsEvent.target).attr('staffId'));
	}

	schedulerAccept(draggable) {
		// Only accept staff draggables
		if ($(draggable).attr('type') === 'staff') {
			return true;
		} else {
			return false;
		}
	}

	handleRecieveEvent(event) {
		// On event recieve, update the db
		const placeholder = {
			staffId: event.staffId,
			jobId: event.resourceId,
			start: event.start,
			end: event.end ? event.end : null
		};
		this.staffService.createStaffPlaceholder(placeholder)
			.then(res => {
				event.placeholderId = res.insertId;
				this.staffScheduler.fullCalendar('updateEvent', event);
			});
		this.staffService.assignStaff(placeholder.jobId, placeholder.staffId);
	}

	handleEventResize(event, delta, revertFunc, ui, view) {
		// On event change, update the db
		const placeholder = {
			staffPlaceholderId: event.placeholderId,
			staffId: event.staffId,
			jobId: event.resourceId,
			start: event.start,
			end: event.end ? event.end : null
		};
		this.staffService.updateStaffPlaceholder(placeholder);
		console.log('eventResize', placeholder);
	}

	handleEventDrop(event, delta, revertFunc, jsEvent, ui, view) {
		const placeholder = {
			staffPlaceholderId: event.placeholderId,
			staffId: event.staffId,
			jobId: event.resourceId,
			start: event.start,
			end: event.end ? event.end : null
		};
		this.staffService.updateStaffPlaceholder(placeholder);

		console.log('eventDrop', placeholder);
	}

}
