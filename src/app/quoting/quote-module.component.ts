import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
	selector: 'app-quoting-module',
	templateUrl: 'quote-module.component.html',
	providers: [MessageService]
})
export class QuoteModuleComponent {

	constructor() {

	}
}
