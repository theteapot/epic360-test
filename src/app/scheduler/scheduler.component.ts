import { Component, OnInit, AfterViewInit, Input, OnChanges, AfterViewChecked } from '@angular/core';
import { StaffService } from '../model/services/staff.service';
import { TaskService } from '../model/services/task.service';
import { EquipmentService } from '../model/services/equipment.service';
import { JobService } from '../model/services/job.service';
import { Staff } from '../model/interfaces/staff.interface';
import { Task } from '../model/interfaces/task.interface';
import { Equipment } from '../model/interfaces/equipment.interface';
import { Job } from '../model/interfaces/job.interface';

import * as sha1 from 'sha1';
import * as fullCalendar from 'fullcalendar';

declare var $: any;

@Component({
	selector: 'app-scheduler',
	templateUrl: './scheduler.component.html',
	styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit, AfterViewInit, AfterViewChecked {

	@Input() nestedScheduler: any;
	scrolled: boolean = false; // Keeps track of whether view has already been scrolled once
	jsonData = {
		title: 'my event'
	};

	showTaskDialog: boolean = false;
	scrollLeftBefore: number; // Keeps track of the current scroll position before an event

	tasks = [
		{ label: 'Select task', value: null },
		{ label: 'P3034', value: 1 },
		{ label: 'P3036', value: 2 }
	];

	events = [
		{
		}
	];

	resources = [];

	constructor(private staffService: StaffService, private jobService: JobService,
		private equipmentService: EquipmentService, private taskService: TaskService) { }

	ngOnInit() {
		const jobPromise = this.jobService.getJobs().then(jobs => {

			this.resources.push({
				id: 'new',
				title: 'Add new job',
				type: 'new'
			});

			for (let job of jobs) {
				if (job.status === 'active') {
					this.resources.push({
						id: job.jobId,
						title: job.title,
						type: 'job'
					});
					this.events.push({
						id: job.jobId,
						title: job.title,
						type: 'job',
						start: job.start,
						end: job.end,
						resourceId: job.jobId
					});
				}
			}
		});

		const staffPromise = this.staffService.getStaffAssignment().then(staffView => {
			for (let staff of staffView) {
				this.resources.push({
					id: `${staff.jobId}-${staff.staffId}`,
					title: `${staff.firstName} ${staff.lastName}`,
					parentId: staff.jobId,
					type: 'staff'
				});
			}
		});

		const taskPromise = this.taskService.getTasks().then(tasks => {
			console.log('all tasks', tasks);
			for (let task of tasks) {
				this.events.push({
					id: task.taskId,
					resourceId: `${task.jobId}-${task.staffId}`,
					title: `${task.registration}: ${task.description}`,
					start: task.start,
					end: task.end,
					type: 'task'
				});
			}
		});

		Promise.all([jobPromise, staffPromise, taskPromise]).then(() => {
			console.log('got resources', this.resources);
			console.log('got events', this.events);
			this.createScheduler();
			this.scrollTo();
			this.ngAfterViewInit();
		});
	}

	createScheduler(): any {
		this.nestedScheduler = $('#scheduler3');
		this.nestedScheduler.fullCalendar({
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
			drop: (date, jsevent, ui, resourecId) => {
				console.log('drop', date, jsevent, ui, resourecId, this);
			},
			slotwidth: 100,
			eventoverlap: false,
			eventRender: (event, element) => {
				console.log('event render', event);
				if (event.type === 'job') {
					element.addClass('job-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.type === 'staff') {
					element.addClass('employee-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.type === 'task') {
					element.addClass('task-event');
				} else {
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				}
			},
			dropAccept: (draggable) => {
				return (this.schedulerAccept(draggable));
			},
			eventReceive: (event) => {
				this.eventReceive(event);
			},
			eventResize: (event, delta, revertFunc, ui, view) => {
				this.eventResize(event, delta, revertFunc, ui, view);
			},
			eventDrop: (event, delta, revertFunc, ui, view) => {
				this.eventDrop(event, delta, revertFunc, ui, view);
			},
			resourceRender: (res, label, body) => {
				$(label.prevObject).attr('type', 'job');
				console.log('resource render', body.prevObject, label);
			},
			events: this.events,
			resources: this.resources
		});
	}

	ngAfterViewChecked() {
		if (!this.scrolled && this.scrollLeftBefore) {
			this.scrollTo(this.scrollLeftBefore);
			this.scrolled = true;
		} else if (!this.scrolled) {
			this.scrollTo();
			this.scrolled = true;
		}
	}

	scrollTo(pos?: number) {
		// Scrolling the calendar so that the current day is centered
		const scroller = $('.fc-body .fc-time-area .fc-scroller-clip .fc-scroller');
		scroller.scrollLeft(pos ? pos : 600);
	}

	ngAfterViewInit() {
		// Creating the new job droppable
		$('.fc-body .fc-resource-area tr[data-resource-id = "new"]').droppable({
			drop: (event, ui) => {
				const resourceId = $(event.target).attr('data-resource-id');
				const elementId = $(ui.draggable).attr('id');
				const elementName = $(ui.draggable).attr('title');
				const elementType = $(ui.draggable).attr('type');

				const jobResource = {
					id: elementId,
					title: elementName,
					type: elementType
				};
				const jobEvent = {
					id: elementId,
					title: elementName,
					resourceId: elementId,
					start: new Date().toString(),
					end: new Date().setDate(new Date().getDate() + 1).toString(),
					allDay: true,
					type: elementType,
				};

				const duplicate = this.nestedScheduler.fullCalendar('getResources').filter(res => res.id === elementId).length > 0;

				if (resourceId === 'new' && elementType === 'job' && !duplicate) {
					console.log('craete new resouce job');
					this.nestedScheduler.fullCalendar('addResource', jobResource, false);
					this.nestedScheduler.fullCalendar('renderEvent', jobEvent, true);
				}
				this.updateResources(jobResource);
				this.updateEvent(jobEvent);
				this.ngAfterViewInit();
			},
			accept: '.job',
			hoverClass: 'highlight'
		});

		// Dropping staff onto jobs
		$('.fc-body .fc-resource-area tr[data-resource-id != "new"]').droppable({
			drop: (event, ui) => {
				// Dropping on row element
				console.log($(event.target));
				const resourceId = $(event.target).attr('data-resource-id');
				const resourceType = $(event.target).attr('type');
				const elementId = $(ui.draggable).attr('id');
				const elementType = $(ui.draggable).attr('type');
				const elementName = $(ui.draggable).attr('name');

				console.log(resourceId, elementType, elementName, elementType, resourceType);
				// If you drag a staff element onto a job element
				if (elementType === 'staff' && resourceType === 'job') {
					const resource = {
						id: `${resourceId}-${elementId}`, type: elementType, title: elementName, parentId: resourceId
					};
					this.nestedScheduler.fullCalendar('addResource', resource);
					this.updateResources(resource);
				}
				// TODO: After a resource has been dropped, should apply this to just that element (rather than all which is what I'm currently doing)
				this.ngAfterViewInit();
			},
			accept: '.staff',
			hoverClass: 'highlight'
		});
	}

	schedulerAccept(element): boolean {
		// Determines whether an element dragged onto the scheduler will be accepted
		console.log('scheudler accept', element);
		if ($(element).attr('type') === 'task') {
			console.log('accepted');
			return true;
		} else {
			return false;
		}
	}

	eventResize(event, delta, revertFunc, ui, view) {
		// Updates DB when an event is resized, both for tasks and jobs
		console.log('event resize', event, delta);
		if (event.type === 'task') {
			this.taskService.updateTask(event.id, { start: event.start, end: event.end });
		} else if (event.type === 'job') {
			this.jobService.updateJob(event.id, { start: event.start, end: event.end });
		}

	}

	eventDrop(event, delta, revertFunc, ui, view) {
		// Updates DB when an event is moved (within the same resource or between)
		console.log('event drop', event, delta);
		if (event.type === 'job') {
			// Shouldnt do anything if jobs are dropped around - hopefully should stop this behaviour
		} else if (event.type === 'task') {
			// Update the tasks staff assignment, and job assignment
			this.taskService.updateTask(event.id, {
				staffId: event.resourceId.split('-')[1],
				jobId: event.resourceId.split('-')[0],
				start: event.start.format('YYYY-MM-DD hh:mm:ss'),
				end: event.end.format('YYYY-MM-DD hh:mm:ss')
			});
		}
	}

	updateResources(resource) {
		// Updates DB when a resource is added or removed
		if (resource.type === 'job') {
			console.log('create job', resource);
		} else if (resource.type === 'staff') {
			const staffId = resource.id.split('-')[1];
			const jobId = resource.id.split('-')[0];
			console.log('assign staff to job', staffId, jobId);
			this.staffService.assignStaff(jobId, staffId);
		}
	}

	eventReceive(event) {
		// Handle the dropping of external events onto the calendar
		// Remove the event that the calendar initially creates
		console.log('event recieve', event);
		/*const eventId = event._id;
		this.nestedScheduler.fullCalendar('removeEvents', (filterEvent) => {
			if (filterEvent._id === eventId) {
				return true;
			} else {
				return false;
			}
		});*/
		// Add in our own events
		this.renderMultipleEvents(event);
		// this.createEvent(event);
		// Update the DB
		const taskId = event.taskId;
		const staffId = event.resourceId.split('-')[1];
		const start = event.start.format('YYYY-MM-DD hh:mm:ss');
		const end = event.end ? event.end.format('YYYY-MM-DD hh:mm:ss') : event.start.add(1, 'hours').format('YYYY-MM-DD hh:mm:ss');
		console.log('event recieve', start, end);
		this.taskService.updateTask(taskId, { staffId: staffId, start: start, end: end });
	}

	renderMultipleEvents(parent) {
		// Given an event object, uses that to create multiple events and returns them.
		// In this case:
		// 		title: parent.equipment = [event.id, ..., event.id]
		// 		id: event.id = event.title
		// 		start: event.start = parent.start

		// Get title array
		const eventEquipment = parent.equipment;
		console.log('render events', parent);
		for (const equip of eventEquipment) {
			const event = {
				title: `${equip} : ${parent.title}`,
				start: parent.start,
				resourceId: parent.resourceId
			};
			this.nestedScheduler.fullCalendar('renderEvent', event);
			// this.createEvent(event); // Update the DB
			// this.events.push(event);
		}
	}

	/*createEvent(event) {
		// Given an event object, add it to the events array, creating multiple entries if required
		console.log('create event', event);
		this.taskService.assignStaff();
	}*/

	updateEvent(event) {
		// Given an event object, update the corresponding DB table with its information
		if (event.type === 'job') {
			// We have created a job resource by dragging
			// This indicates the job has moved from inactive to active
			this.jobService.changeStatus(event.id, 'active');
		} else if (event.type === 'staff') {
		}
	}

	/* getResourceText(resource): string {
		// Gets the appropriate resource text
		console.log('resourceText', resource);
		if (resource.type === 'job') {
			return resource.title;
		} else if (resource.type === 'staff') {
			return resource.name;
		}
	}*/

	hasher(str: string): string {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = ((hash << 5) - hash) + str.charCodeAt(i);
			hash = hash & hash;
		}
		return '#' + hash.toString(16).slice(0, 6);
	}
}
