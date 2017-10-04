import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

declare var $: any;

@Component({
	selector: 'app-staging-area',
	templateUrl: './staging-area.component.html',
	styleUrls: ['./staging-area.component.css']
})
export class StagingAreaComponent implements OnInit, AfterViewInit {

	tasks = [
		{ id: 't1', desc: 'my task', title: 'title' },
		{ id: 't2', desc: 'my task2', title: 'title2' },
	];

	equipment = [
		{ id: 'e2', name: 'P5172', desc: '4T Tipper' },
		{ id: 'e3', name: 'P3040', desc: '5T Digger' }
	];

	jobs = [
		{ id: 'j2', desc: 'my job' },
		{ id: 'j2', desc: 'my job2' }
	];

	staff = [
		{ id: 's1', desc: 'First First' },
		{ id: 's2', desc: 'Last First' },
		{ id: 's3', desc: 'First Last' },
	];

	constructor(private dragulaService: DragulaService) {
		dragulaService.setOptions('first-bag', {
			copy: (el, source) => {
				console.log('copy', el, source);
				// Only copy from equipment -> task, not task -> equipment
				if ($(source).attr('id') === 'equipmentBag') {
					return true;
				} else {
					return false;
				}
			},
			removeOnSpill: true
		});

		dragulaService.drop.subscribe((value) => {
			// console.log('drop', value);
			// console.log($(value[1]).text());
			// console.log('parents', $(value[2]).parents('.draggable'));
			// console.log('currData', $(value[2]).parents('.draggable').data('event'));

			let currData = $(value[2]).parents('.draggable').data('event');
			if (!currData) {
				currData = {
					title: $(value[1]).find('.handle').text(),
					equipment: []
				};
			}
			currData.equipment.push($(value[1]).find('.handle').text());
			// Extend the currData with the new plant name
			console.log('handle', $(value[1]).find('.handle').text());
			// console.log('currData', $(value[2]).parents('.draggable').data('event'));

			$(value[2]).parents('.draggable').data('event', currData);
		});
	}

	ngAfterViewInit() {
		$('.draggable')
			.draggable({
				revert: true,
				revertDuration: 1,
				handle: '.handle',
				helper: () => {
					return $('<div style="background: lightblue; min-width: 50px; min-height: 20px; border-style: solid; border-width: 1px"></div>');
				},
				cursorAt: { left: 0, top: 0 }
			});
	}

	ngOnInit() { }

}
