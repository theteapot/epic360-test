import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { StaffService } from '../model/services/staff.service';
import { TaskService } from '../model/services/task.service';
import { EquipmentService } from '../model/services/equipment.service';
import { JobService } from '../model/services/job.service';
import { Staff } from '../model/interfaces/staff.interface';
import { Task } from '../model/interfaces/task.interface';
import { Equipment } from '../model/interfaces/equipment.interface';
import { Job } from '../model/interfaces/job.interface';

declare var $: any;

@Component({
	selector: 'app-staging-area',
	templateUrl: './staging-area.component.html',
	styleUrls: ['./staging-area.component.css']
})
export class StagingAreaComponent implements OnInit, AfterViewInit {

	tasks: Task[];

	equipment: Equipment[];

	jobs: Job[];

	staff: Staff[];

	constructor(private dragulaService: DragulaService, private staffService: StaffService,
		private jobService: JobService, private equipmentService: EquipmentService,
		private taskService: TaskService) {
		this.initialiseDragula(dragulaService);
	}

	initialiseDragula(dragulaService: DragulaService) {
		// Sets up options for the dragulaService
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
			let currData = $(value[2]).parents('.draggable').data('event');
			const taskTitle = $(value[2]).parents('.draggable').find('h4').text().trim();
			if (!currData) {
				currData = {
					title: taskTitle,
					equipment: []
				};
			}
			currData.equipment.push($(value[1]).find('.handle').text());
			// Extend the currData with the new plant name
			$(value[2]).parents('.draggable').data('event', currData);
			console.log($(value[2]).parents('.draggable').data('event'));
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

	initDraggables(selector: string) {
		// Small timeout to give angular time to render the view before we use it
		// N.B. there is probably be a better way to do this
		setTimeout( () => {
			$(selector).draggable({
				revert: true,
				revertDuration: 1,
				handle: '.handle',
				helper: () => {
					return $('<div style="background: lightblue; min-width: 50px; min-height: 20px; border-style: solid; border-width: 1px"></div>');
				},
				cursorAt: { left: 0, top: 0 }
			});
		}, 0.5);
	}

	ngOnInit() {
		this.staffService.getStaff().then(staff => {
			this.staff = staff;
			console.log('got staff', staff);
			this.initDraggables('.draggable.staff');
		});
		this.jobService.getJobs().then(jobs => {
			this.jobs = jobs;
			this.initDraggables('.draggable.job');
		});
		this.equipmentService.getEquipment().then(equipment => {
			this.equipment = equipment;
			this.initDraggables('.draggable.equipment');
		});
		this.taskService.getTasks().then(tasks => {
			this.tasks = tasks;
			this.initDraggables('.draggable.task');
		});
	}

}
