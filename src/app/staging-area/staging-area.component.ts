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
		{ id: 't1', desc: 'my task' },
		{ id: 't2', desc: 'my task2' },
	];

	equipment = [
		{ id: 'e2', desc: 'P3040' },
		{ id: 'e3', desc: 'P3040' }
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
	}

	ngAfterViewInit() {
		$('.task').data('event', { title: 'my event' }).draggable({ revert: true, revertDuration: 1, handle: 'h4' }).draggable('enable');
	}

	ngOnInit() { }

}
