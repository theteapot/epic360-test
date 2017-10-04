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

		this.nestedScheduler = $('#scheduler3');
		this.nestedScheduler.fullCalendar({
			header: {
				center: 'timeline, timelineMonth'
			},
			defaultView: 'timeline',
			defaultDate: '2017-10-04',
			visibleRange: (currentDate) => {
				return {
					start: currentDate.clone().subtract(20, 'days'),
					end: currentDate.clone().add(20, 'days') // exclusive end, so 3
				};
			},
			slotLabelFormat: [
				'DD/MM'
			],
			eventResourceEditable: true,
			editable: true,
			droppable: true,
			aspectRatio: 2.5,
			eventoverlap: false,
			eventRender: (event, element) => {
				if (event.resourceId.match(/([j][\d])(?!-)/i)) {
					element.addClass('job-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(s\d\d)(?!-)/i)) {
					element.addClass('employee-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				} else if (event.resourceId.match(/(p\d\d-t)/i)) {
					element.addClass('task-event');
					element.css('background-color', '#' + sha1(event.title).slice(0, 6));
				}
			},
			drop: (date, jsEvent, ui, resourceId) => {
				console.log('jsEvent', jsEvent, 'ui', ui, 'resourceId', resourceId);
				// Prompt user to assign a task
			},
			dropAccept: (draggable) => {
				return (this.schedulerAccept(draggable));
			},
			eventReceive: (event) => {
				this.renderMultipleEvents(event);
				console.log('eventRecieve', event);
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
		// Creating resource area as droppable

		// Creating the new job droppable
		$('.fc-body .fc-resource-area tr[data-resource-id = "new"]').droppable({
			drop: (event, ui) => {
				const resourceId = $(event.target).attr('data-resource-id');
				const elementId = $(ui.draggable).attr('id');
				const elementName = $(ui.draggable).attr('name');

				if (resourceId === 'new' && elementId.match(/[j]\d/)) {
					console.log('craete new resouce job');
					this.nestedScheduler.fullCalendar('addResource', {
						id: elementId, title: elementName
					});
					this.nestedScheduler.fullCalendar('renderEvent', {
						id: elementId, title: elementName, resourceId: elementId, start: Date().toString()
					}, true);
				}
				this.ngAfterViewInit();
			},
			accept: '.job',
			hoverClass: 'highlight'
		});

		// Creating the job resource droppables
		$('.fc-body .fc-resource-area tr[data-resource-id != "new"]').droppable({
			drop: (event, ui) => {
				console.log('drop', event, ui);
				// Dropping on row element
				const resourceId = $(event.target).attr('data-resource-id');
				const elementId = $(ui.draggable).attr('id');
				const elementName = $(ui.draggable).attr('name');
				console.log(resourceId, elementId, elementName);
				// If you drag a staff element onto a job element
				if (elementId.match(/[s]\d/) && resourceId.match(/[j]\d/)) {
					console.log('adding staff to job');
					this.nestedScheduler.fullCalendar('addResource', {
						id: elementId, title: elementName, parentId: resourceId
					});
					// If you drag a job element onto the new resource
				}
				// TODO: After a resource has been dropped, should apply this to just that element (rather than all which is what I'm currently doing)
				this.ngAfterViewInit();
			},
			accept: '.staff',
			hoverClass: 'highlight'
		});
	}

	initStaffDroppable() {
		// initialises a staff event as a droppable for recieving plant objects

	}

	schedulerAccept(element): boolean {
		// Determines whether an element dragged onto the scheduler will be accepted
		if (element.attr('id').match(/[t]\d*/)) {
			return true;
		} else {
			return false;
		}
	}

	renderMultipleEvents(parent) {
		// Given an event object, uses that to create multiple events and returns them.
		// In this case:
		// 		title: parent.equipment = [event.id, ..., event.id]
		// 		id: event.id = event.title
		// 		start: event.start = parent.start

		// Get title array
		const eventTitles = parent.equipment.slice(1);
		console.log(eventTitles);
		for (const title of eventTitles) {
			this.nestedScheduler.fullCalendar('renderEvent', {
				title: title,
				start: parent.start,
				resourceId: parent.resourceId
			});
		}
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
