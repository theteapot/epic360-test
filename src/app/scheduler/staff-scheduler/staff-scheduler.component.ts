import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
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
	staff: any;
	@Input() selectedStaff: any[] = []; // Keeps track of the people who are selected

	resources: { id: number, title: string, type: string }[] = [];
	events: {
		staffId: any,
		title?: string,
		start: any,
		end?: string,
		rendering?: string,
		resourceId: number,
		placeholderId?: number,
		color?: string
	}[] = [];
	filteredResources: { id: number, title: string, type: string }[] = [];
	filteredEvents: {
		staffId: any,
		title?: string,
		start: any,
		end?: string,
		rendering?: string,
		resourceId: number,
		placeholderId?: number,
		color?: string
	}[] = [];

	constructor(private jobService: JobService, private staffService: StaffService,
		private taskService: TaskService) {
	}

	ngOnInit() {
		this.staffService.getStaff()
			.then(staff => this.staff = staff);

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
							rendering: 'background',
							color: this.pickColor(job.jobId)
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
						title: event.name,
						resourceId: event.jobId,
						placeholderId: event.staffPlaceholderId,
						color: this.pickColor(event.staffId)
					});
				}
			});

		Promise.all([jobPromise, staffPlaceholderPromise]).then(res => {
			this.filteredEvents = this.events;
			this.filteredResources = this.resources;
			this.createScheduler();
		});
	}

	filterStaff() {
		// Updating filters when selectedStaff changes
		this.staffScheduler.fullCalendar('rerenderEvents');
	}

	createScheduler(): any {
		console.log('creating staffScheduler', this.resources, this.events);
		this.staffScheduler = $('#staff-scheduler');
		this.staffScheduler.fullCalendar({
			header: {
				center: 'timeline, timelineMonth'
			},
			displayEventTime: false,
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
			slotwidth: 75,
			eventoverlap: false,
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
			eventRender: (event, element, view) => {
				const render = this.handleEventRender(event, element, view);
				console.log(render);
				if (!render) { return false; }
			},
			resourceRender: (res, label, body) => {
			},
			events: this.filteredEvents,
			resources: this.filteredResources
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

	handleEventRender(event, element, view) {
		console.log(event);
		event.color = this.pickColor(event.staffId);
		if (this.selectedStaff.length === 0) {
			return true;
		}
		if (this.selectedStaff.includes(event.staffId) || event.rendering === 'background') {
			console.log('fountd', event);
			return true;
		} else {
			return false;
		}
	}

	pickColor(id: number) {
		// Returns a css color name determined by the id
		const colors = ['sienna', 'tan', 'gold', 'greenyellow', 'orchid', 'deepskyblue',
			'darkseagreen', 'lightcoral', 'lightcyan', 'fuchsia', 'mediumvioletred', 'tan',
			'turquoise'];
		return colors[colors.length % id];
	}

}
