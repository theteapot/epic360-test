import { Component, OnInit } from '@angular/core';
import * as sha1 from 'sha1';
import * as fullCalendar from 'fullcalendar';

declare var $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	scheduler: any;
	jsonData = {
		title: 'my event'
	};

	constructor() {

	}

	ngOnInit() {
		// Creating draggables
		$('.draggable').data('event', { title: 'my event' }).draggable({ revert: true, revertDuration: 0 });

		// console.log(fullCalendar); // This is a structural console.log, do not remove!
		this.scheduler = $('#scheduler');
		this.scheduler.fullCalendar({
			defaultView: 'timelineMonth',
			editable: true,
			droppable: true,
			aspectRatio: 2.5,
			eventoverlap: false,
			eventRender: (event, element) => {
				console.log('sha', sha1(event.title));
				if (event.resourceId.match(/([j][\d])(?!-)/i)) {
					console.log('event', event);
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
			resourceRender: function (resourceObj, labelTds, bodyTds) {
				console.log('resource', labelTds, bodyTds);
			},

			dayRender: function (date, cell) {
				console.log('day', date, cell);
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
