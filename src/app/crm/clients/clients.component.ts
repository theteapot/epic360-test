import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientService } from '../../model/services/client.service';

@Component({
	selector: 'app-clients',
	templateUrl: './clients.component.html',
	styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

	clients: any[] = [];
	@Output() selectClientEvent = new EventEmitter();
	selectedClient: any;

	clientForm: FormGroup;
	contactForm: FormGroup;
	officeForm: FormGroup;

	showClientForm: boolean;
	showContactForm: boolean;
	showOfficeForm: boolean;


	constructor(private fb: FormBuilder, private clientService: ClientService) {

		this.clientForm = fb.group({
			name: [''],
			description: ['']
		});

		this.contactForm = fb.group({
			name: [''],
			address: [''],
			email: [''],
			cellphone: ['']
		});

		this.officeForm = fb.group({
			street: [''],
			suburb: [''],
			city: [''],
			postCode: ['']
		});

		const clientPromise = this.clientService.getClients();
		const contactPromise = this.clientService.getContacts();
		const officePromise = this.clientService.getOffices();

		Promise.all([clientPromise, contactPromise, officePromise])
			.then(values => {
				for (let client of values[0]) {
					const listObj = { label: client.name, value: client };
					console.log('client', client);
					listObj.value.contacts = values[1].filter(contact => {
						return contact.clientId === client.clientId;
					});
					listObj.value.offices = values[2].filter(office => {
						return office.clientId === client.clientId;
					});
					this.clients.push(listObj);
				}
				console.log('clients', this.clients);
			});

	}

	ngOnInit() {
	}

	createContact() {
		this.clientService.createContact(this.selectedClient.clientId, this.contactForm.value)
			.then( res => {
				this.selectedClient.contacts.push(this.contactForm.value);
				this.showContactForm = false;
			});
	}

	createOffice() {
		this.clientService.createOffice(this.selectedClient.clientId, this.officeForm.value)
			.then( res => {
				this.selectedClient.offices.push(this.officeForm.value);
				this.showOfficeForm = false;
			});
	}

}
