import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Task } from '../interfaces/task.interface';
import { EpicDbDatasource } from '../datasources/epic-db.datasource';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

@Injectable()
export class TaskService {

	task: Task[];

	constructor(private datasource: EpicDbDatasource) {	}

	getTasks(): Promise<Task[]> {
		return this.datasource.getData('read/TaskView')
			.then( res => {
				const data: Task[] = [];
				res.forEach(element => {
					element.value = element.taskId;
					element.start = element.start ? moment(element.start) : null;
					element.end = element.end ? moment(element.end) : null;
					element.title = `${element.registration}: ${element.firstName} ${element.lastName}`;
					data.push(element);
				});
				console.log('tasks', data);
				return data;
			});
	}

	createTask(task: Task) {
		return this.datasource.postData('create/Task', task);
	}

	createTasks(tasks: Task[], jobId: number) {
		// Creating multiple tasks
		return this.datasource.postData(`create/many/Task/${jobId}`, tasks);
	}

	updateTask(task: Task) {
		return this.datasource.putData('update/Task', task);
	}

	deleteTask(task: Task) {
		return this.datasource.deleteData('delete/Task/:taskId');
	}

	getTaskTemplates(): Promise<Task[]> {
		return this.datasource.getData('read/TaskTemplate')
			.then( res => {
				const data: Task[] = [];
				res.forEach(element => {
					element.value = element.taskId;
					element.title = `${element.registration}: ${element.firstName}`;
					data.push(element);
				});
				console.log('tasks', data);
				return data;
			});
	}

}
