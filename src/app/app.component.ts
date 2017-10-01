import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import * as sha1 from 'sha1';
import * as fullCalendar from 'fullcalendar';

declare var $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

	scheduler: any;
	altScheduler: any;
	@Input() nestedScheduler: any;

	jsonData = {
		title: 'my event'
	};
	showTaskDialog: boolean = false;

	tasks = [
		{ label: 'Select task', value: null },
		{ label: 'P3034', value: 1 },
		{ label: 'P3036', value: 2 }
	];

	constructor() {

	}

	toggleTaskDialog() {
		this.showTaskDialog = !this.showTaskDialog;
		console.log('toggle task', this.showTaskDialog);
	}

	ngOnInit() {
		// Creating draggables
		$('.draggable').data('event', { title: 'my event' }).draggable({ revert: true, revertDuration: 0 }).addClass('job');

		// console.log(fullCalendar); // This is a structural console.log, do not remove!
		this.scheduler = $('#scheduler');
		this.scheduler.fullCalendar({
			defaultView: 'timelineMonth',
			eventResourceEditable: false,
			editable: true,
			droppable: true,
			aspectRatio: 2.5,
			eventoverlap: false,
			eventRender: (event, element) => {
				if (event.resourceId.match(/([j][\d])(?!-)/i)) {
					element.addClass('job-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(j\d-e\d)(?!-)/i)) {
					element.addClass('employee-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(j\d-e\d-t)/i)) {
					element.addClass('task-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				}
			},
			drop: function (date, jsEvent, ui, resourceId) {
				console.log('drop', date, jsEvent, ui, resourceId);
			},
			eventAllow: (dropLocation, draggedEvent) => {
				// Only allow dragging between plants resources, or the same resource
				console.log(draggedEvent.resourceId, dropLocation.resourceId);
				if ((dropLocation.resourceId === draggedEvent.resourceId) ||
					(dropLocation.resourceId.match(/(j\d-e\d-t)/i) && draggedEvent.resourceId.match(/(j\d-e\d-t)/i))) {
					return true;
				}
			},
			events: [
				{
					title: 'J1001',
					start: '2017-09-01',
					end: '2017-09-07',
					resourceId: 'j1',
				},
				{
					title: 'J1002',
					start: '2017-09-02',
					end: '2017-09-14',
					resourceId: 'j2',
				},
				{
					title: 'E2001',
					start: '2017-09-01',
					end: '2017-09-02',
					resourceId: 'j1-e1'
				},
				{
					title: 'E2001',
					start: '2017-09-05',
					end: '2017-09-05',
					resourceId: 'j1-e1'
				},
				{
					title: 'E2002',
					start: '2017-09-02',
					end: '2017-09-08',
					resourceId: 'j2-e2'
				},
				{
					title: 'E2002',
					start: '2017-09-10',
					end: '2017-09-14',
					resourceId: 'j2-e2'
				},
				{
					title: 'E2001',
					start: '2017-09-07',
					end: '2017-09-10',
					resourceId: 'j2-e1'
				},
				{
					title: 'E2001',
					start: '2017-09-13',
					end: '2017-09-14',
					resourceId: 'j2-e1'
				},
				{
					title: 'P3030',
					start: '2017-09-01',
					end: '2017-09-02',
					resourceId: 'j1-e1-t',
				},
				{
					title: 'P3030',
					start: '2017-09-05',
					end: '2017-09-06',
					resourceId: 'j1-e1-t',
				},
				{
					title: 'P3034',
					start: '2017-09-02',
					end: '2017-09-08',
					resourceId: 'j2-e2-t',
				},
				{
					title: 'P4034',
					start: '2017-09-06',
					end: '2017-09-08',
					resourceId: 'j2-e2-t',
				},
				{
					title: 'P4034',
					start: '2017-09-10',
					end: '2017-09-14',
					resourceId: 'j2-e2-t',
				},
				{
					title: 'P1000',
					start: '2017-09-07',
					end: '2017-09-10',
					resourceId: 'j2-e1-t',
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2017-09-02T16:00:00',
					resourceId: '1'
				},
			],
			resources: [
				{
					id: 'j1',
					title: 'J1001: Descriptive Title',
					children: [
						{
							id: 'j1-e1',
							title: 'E2001: Staff Name',
							children: [
								{
									id: 'j1-e1-t',
									title: 'Plants'
								}
							]
						}
					]
				},
				{
					id: 'j2',
					title: 'J1002: Descriptive Title',
					children: [
						{
							id: 'j2-e2',
							title: 'E2002: Staff Name',
							children: [
								{
									id: 'j2-e2-t',
									title: 'Plants'
								}
							]
						},
						{
							id: 'j2-e1',
							title: 'E2001: Staff Name',
							children: [
								{
									id: 'j2-e1-t',
									title: 'Plants'
								}
							]
						}
					]
				},

			]
		});
		this.altScheduler = $('#scheduler2');
		// console.log(fullCalendar); // This is a structural console.log, do not remove!
		this.altScheduler.fullCalendar({
			defaultView: 'timelineMonth',
			eventResourceEditable: true,
			editable: true,
			droppable: true,
			aspectRatio: 2.5,
			eventoverlap: false,
			eventRender: (event, element) => {
				if (event.resourceId.match(/([j][\d])(?!-)/i)) {
					element.addClass('job-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(j\d-e\d)(?!-)/i)) {
					element.addClass('employee-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(j\d-e\d-t)/i)) {
					element.addClass('task-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				}
			},
			drop: (date, jsEvent, ui, resourceId) => {
				console.log('drop', date, jsEvent, ui, resourceId);
				// Prompt user to assign a task
				this.toggleTaskDialog();
			},
			events: [
				{
					title: 'J1001',
					start: '2017-09-01',
					end: '2017-09-07',
					resourceId: 'j1',
				},
				{
					title: 'J1002',
					start: '2017-09-02',
					end: '2017-09-14',
					resourceId: 'j2',
				},
				{
					title: 'E2001',
					start: '2017-09-01',
					end: '2017-09-02',
					resourceId: 'j1-e'
				},
				{
					title: 'E2001',
					start: '2017-09-05',
					end: '2017-09-05',
					resourceId: 'j1-e'
				},
				{
					title: 'E2002',
					start: '2017-09-02',
					end: '2017-09-08',
					resourceId: 'j2-e'
				},
				{
					title: 'E2002',
					start: '2017-09-10',
					end: '2017-09-14',
					resourceId: 'j2-e'
				},
				{
					title: 'E2001',
					start: '2017-09-07',
					end: '2017-09-10',
					resourceId: 'j2-e'
				},
				{
					title: 'E2001',
					start: '2017-09-13',
					end: '2017-09-14',
					resourceId: 'j2-e'
				},
			],
			resources: [
				{
					id: 'j1',
					title: 'J1001: Descriptive Title',
					children: [
						{
							id: 'j1-e',
							title: 'Staff',
						}
					]
				},
				{
					id: 'j2',
					title: 'J1002: Descriptive Title',
					children: [
						{
							id: 'j2-e',
							title: 'Staff',
						}
					]
				},

			]
		});
		this.nestedScheduler = $('#scheduler3');
		this.nestedScheduler.fullCalendar({
			defaultView: 'timelineMonth',
			eventResourceEditable: true,
			editable: true,
			droppable: true,
			aspectRatio: 2.5,
			eventoverlap: false,
			eventRender: (event, element) => {
				if (event.resourceId.match(/([j][\d])(?!-)/i)) {
					element.addClass('job-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(j\d-e\d)(?!-)/i)) {
					element.addClass('employee-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(j\d-e\d-t)/i)) {
					element.addClass('task-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				}
			},
			drop: (date, jsEvent, ui, resourceId) => {
				console.log('drop', date, jsEvent, ui, resourceId);
				// Prompt user to assign a task
				this.toggleTaskDialog();
			},
			eventClick: (event, jsEvent, view) => {
				// Remove all current resources
				let resourceId = 0;
				for (let resource of this.nestedScheduler.fullCalendar('getResources')) {
					if (resource.title !== event.title) {
						this.nestedScheduler.fullCalendar('removeResource', resource.id);
					} else {
						resourceId = resource.id;
					}
				}
				this.nestedScheduler.fullCalendar('addResource', { id: 'e', title: 'E2001', parentId: resourceId });
				this.nestedScheduler.fullCalendar('refetchEvents');
			},
			events: [
				{
					title: 'J1001',
					start: '2017-09-01',
					end: '2017-09-07',
					resourceId: 'j1',
				},
				{
					title: 'E2030',
					start: '2017-09-01',
					end: '2017-09-07',
					resourceId: 'e',
				}
			],
			resources: [
				{
					id: 'new',
					title: 'Add new job'
				},
				{
					id: 'j1',
					title: 'J1001: Descriptive Title'
				}
			]
		});

	}

	ngAfterViewInit() {
		console.log('initialising row');
		$('tr [data-resource-id]').droppable({
			drop: (event, ui) => {
				// Dropping on row element
				const resourceId = $(event.target).attr('data-resource-id');

				if ( resourceId !== 'new') {
					console.log('dropping on fg', $(event.target).attr('data-resource-id'));
					this.nestedScheduler.fullCalendar('addResource', {
						id: ui.draggable.attr('id'), title: ui.draggable.attr('name'), parentId: resourceId
					});
				} else { // Dropping on create new job element
					this.nestedScheduler.fullCalendar('addResource', {
						id: ui.draggable.attr('id'), title: ui.draggable.attr('name')
					});
				}
				this.ngAfterViewInit();
			}
		});
	}

	initStaffDroppable() {
		// initialises a staff event as a droppable for recieving plant objects

	}

	createNewNestedCalendar() {
		this.nestedScheduler.fullCalendar({
			defaultView: 'timelineMonth',
			eventResourceEditable: true,
			editable: true,
			droppable: true,
			aspectRatio: 2.5,
			eventoverlap: false,
			eventRender: (event, element) => {
				if (event.resourceId.match(/([j][\d])(?!-)/i)) {
					element.addClass('job-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(j\d-e\d)(?!-)/i)) {
					element.addClass('employee-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(j\d-e\d-t)/i)) {
					element.addClass('task-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				}
			},
			drop: (date, jsEvent, ui, resourceId) => {
				console.log('drop', date, jsEvent, ui, resourceId);
				// Prompt user to assign a task
				this.toggleTaskDialog();
			},
			eventRecieve: (event) => {
				console.log(event);
			},
			eventClick: (event, jsEvent, view) => {
				console.log(this.nestedScheduler);
			},
			events: [
				{
					title: 'E2002',
					start: '2017-09-01',
					end: '2017-09-07',
					resourceId: 'j1',
				}
			],
			resources: [
				{
					id: 'j1',
					title: 'J1001: Descriptive Title',
					children: [
						{
							id: 'j1-e',
							title: 'Staff',
						}
					]
				}
			]
		});
	}

	hasher(str: string): string {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = ((hash << 5) - hash) + str.charCodeAt(i);
			hash = hash & hash;
		}
		console.log(str, '#' + hash.toString(16));
		return '#' + hash.toString(16).slice(0, 6);
	}
}
