import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { StaffService } from '../../model/services/staff.service';
import { TaskService } from '../../model/services/task.service';
import { EquipmentService } from '../../model/services/equipment.service';
import { JobService } from '../../model/services/job.service';
import { Staff } from '../../model/interfaces/staff.interface';
import { Task } from '../../model/interfaces/task.interface';
import { Equipment } from '../../model/interfaces/equipment.interface';
import { Job } from '../../model/interfaces/job.interface';


declare var $: any;

@Component({
	selector: 'app-staging-area',
	templateUrl: './staging-area.component.html',
	styleUrls: ['./staging-area.component.css']
})
export class StagingAreaComponent implements OnInit, AfterViewInit {

	tasks: Task[];
	filteredTasks: Task[];

	equipment: Equipment[];

	jobs: Job[];

	staff: Staff[];

	selectedJob: Job;

	selectedTaskPanel: string = 'assign'; // Keeps track of whether we are in the assigning or creating task page.
	taskPanelOptions: any[];

	newTaskForm: FormGroup;
	workTypes: any[]; // Work types for dropdown menu

	constructor(private dragulaService: DragulaService, private staffService: StaffService,
		private jobService: JobService, private equipmentService: EquipmentService,
		private taskService: TaskService, private formBuilder: FormBuilder) {

		this.taskPanelOptions = [
			{ label: 'Assign', value: 'assign' },
			{ label: 'Create', value: 'create' }
		];

		this.workTypes = [
			{ label: 'Type 0', value: 0 },
			{ label: 'Type 1', value: 1 }
		];

		this.newTaskForm = formBuilder.group({
			header: ['', Validators.required],
			description: ['', Validators.required],
			workType: ['', Validators.required],
		});

	}

	ngOnInit() {
		this.staffService.getStaff().then(staff => {
			this.staff = staff;
			console.log('got staff', staff);
			this.initDraggables('.draggable.staff');
		});
		this.jobService.getJobs().then(jobs => {
			console.log('got jobs', jobs);
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

		this.initialiseDragula(this.dragulaService);

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
			console.log('fix1', $(value[2]).parents('.draggable'), $(value[1]));
			const taskTitle = $(value[2]).parents('.draggable').find('h4').text().trim();
			if (!currData) {
				currData = {
					title: taskTitle,
					equipment: [],
					taskId: $(value[2]).attr('taskId'),
					equipmentId: $(value[1]).attr('equipmentId')
				};
			}
			currData.equipment = [($(value[1]).find('.handle').text())];
			$(value[2]).parents('.draggable').data('event', currData);

			// Post to the DB
			const equipmentId = $(value[1]).attr('equipmentId');
			const taskId = $(value[2]).attr('taskId');
			this.taskService.assignEquipment(taskId, equipmentId);
		});

		dragulaService.remove.subscribe((value) => {
			// Post to the DB
			const taskId = $(value[2]).attr('taskId');
			this.taskService.unassignEquipment(taskId);
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
		setTimeout(() => {
			// Set the properties (if they are not set already)
			const draggables = $(selector);
			for (let i = 0; i < draggables.length; i++) {

				var drag = draggables[i];
				const event = {
					title: $(drag).find('h4').text().trim() + ': ' + $(drag).find('.equipment .handle').text().trim(),
					equipment: [],
					equipmentId: $(drag).find('.equipment').attr('equipmentId'),
					taskId: $(drag).find('.container').attr('taskId')
				};
				console.log('drag event', event)
				$(drag).data('event', event);
			} 	/* {
					title:
					taskId:
					equipmentId:
				}*/

			// Initialise the dragging
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

	taskPanelChange() {
		// Makes it so that when we navigate back from the create panel we will reinit the task panel
		// so new changes are reflected
		if (this.selectedTaskPanel === 'assign') {
			console.log('at panel assign');
			this.filterTasks();
		}
	}

	filterTasks() {
		// Filters the tasks
		this.filteredTasks = this.tasks.filter(task => {
			return task.jobId === this.selectedJob.jobId;
		});
		console.log('task filter', this.filteredTasks);
		this.initDraggables('.draggable.task');
	}

	createTask() {
		const task = {
			jobId: this.selectedJob.jobId,
			header: this.newTaskForm.value.header,
			description: this.newTaskForm.value.description,
			workType: this.newTaskForm.value.workType
		};

		this.taskService.createTask(task).then((res) => {
			this.tasks.push(task);
		});
	}


}
