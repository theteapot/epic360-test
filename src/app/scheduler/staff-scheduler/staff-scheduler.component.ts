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
	selectedEvent: any; // When we click on an event this is set
	showEventDialog: boolean = false; // Whether or not we should show the event dialog


	resources: { id: number, title: string, type: string }[] = [];
	events: {
		staffId?: string,
		title?: string,
		start: any,
		end?: string,
		rendering?: string,
		resourceId: number,
		staffPlaceholderId?: number,
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
		staffPlaceholderId?: number,
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
						staffPlaceholderId: event.staffPlaceholderId,
						color: this.pickColor(event.staffId)
					});
				}
			});

		Promise.all([jobPromise, staffPlaceholderPromise]).then(res => {
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
				'MMM DD'
			],
			snapDuration: { hours: 12 },
			eventResourceEditable: true,
			editable: true,
			droppable: true,
			drop: (date, jsEvent, ui, resourceId) => {
				this.handleDrop(date, jsEvent, ui, resourceId);
			},
			slotwidth: '25px',
			resourceAreaWidth: '200px',
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
			eventClick: (event, jsEvent, view) => {
				this.handleEventClick(event, jsEvent, view);
			},
			eventDestroy: (event, element, view) => {
				console.log('removing from DOM', event, element, view);
			},
			resourceRender: (res, label, body) => {
			},
			resourceLabelText: 'Jobs',
			events: this.events,
			resources: this.resources
		});
	}

	handleDrop(date, jsEvent, ui, resourceId) {
		console.log('eventDrop', 'jobId', resourceId, 'staffId', $(jsEvent.target).attr('staffId'));
	}

	schedulerAccept(draggable) {
		// Only accept staff draggables
		if ($(draggable).attr('type') === 'staff') {
			console.log('accepting', draggable);
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
			// Update the values
			.then(res => {
				event.staffPlaceholderId = res.insertId;
				this.staffScheduler.fullCalendar('updateEvent', event);
			});
		// this.staffService.assignStaff(placeholder.jobId, placeholder.staffId);
	}

	handleEventClick(event, jsEvent, view) {
		console.log('displaying event dialog', event);
		// Displays dialog over the event
		this.selectedEvent = event;
		this.showEventDialog = true;
	}

	handleEventResize(event, delta, revertFunc, ui, view) {
		// On event change, update the db
		const placeholder = {
			staffPlaceholderId: event.staffPlaceholderId,
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
			staffPlaceholderId: event.staffPlaceholderId,
			staffId: event.staffId,
			jobId: event.resourceId,
			start: event.start,
			end: event.end ? event.end : null
		};
		this.staffService.updateStaffPlaceholder(placeholder);

		console.log('eventDrop', placeholder);
	}

	handleEventRender(event, element, view) {
		event.color = this.pickColor(event.staffId);
		console.log('rendering', event);
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

	removeEvent(event) {
		// Removes that staff placeholder element
		this.staffService.removeStaffPlaceholder(event)
			.then(res => {
				console.log('removing event', event._id);
				this.staffScheduler.fullCalendar('removeEvents', eventObj => {
					console.log('removing events check', eventObj, event);
					if (eventObj._id === event._id) {
						return true;
					} else {
						return false;
					}
				});
			});
		this.showEventDialog = false;
	}


	pickColor(id: number) {
		// Returns a css color name determined by the id
		const colors = ['sienna', 'tan', 'gold', 'greenyellow', 'orchid', 'deepskyblue',
			'darkseagreen', 'lightcoral', 'lightcyan', 'fuchsia', 'mediumvioletred', 'tan',
			'turquoise'];
		return colors[id % colors.length];
	}

}
