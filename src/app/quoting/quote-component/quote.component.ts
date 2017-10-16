import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { QuoteService } from '../../model/services/quote.service';

@Component({
	selector: 'app-quote-component',
	templateUrl: './quote.component.html',
	styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {

	quoteId: number;
	quotes: any;
	quote: Observable<any>;
	selectedQuote: any; // The quote selected on the sidebar
	quoteRows: any[]; // All of the rows for the selected quote
	selectedRow: any; // The row the user clicks on in the table
	displayDialog: boolean;
	newEntry: boolean; // Whether the user is creating or updating a row

	constructor(
		private route: ActivatedRoute,
		private quoteService: QuoteService
	) {
		this.quoteService.getQuotes().then(quotes => {
			this.quotes = quotes.map(quote => {
				return {
					label: quote.quoteId,
					value: quote
				};
			});
		});
	}

	ngOnInit() {

	}

	downloadPdf() {
		this.quoteService.getPdf(this.selectedQuote.quoteId)
			.then(pdf => {
				console.log('pdf string', pdf);
				const fileUrl = URL.createObjectURL(pdf);
				window.open(fileUrl);
			});
	}

	selectQuote(quote: any) {
		this.quoteService.getQuoteRows(quote.quoteId).then(quoteRows => this.quoteRows = quoteRows);
		this.selectedQuote = quote;
		console.log('selected quote', quote);
	}


	onRowSelect(event) {
		this.newEntry = false;
		this.selectedRow = event.data;
		console.log(this.selectedRow);
		this.displayDialog = true;
	}

	showDialogToAdd() {
		this.newEntry = true;
		this.selectedRow = {
			description: '',
			amount: '',
			cost: '',
			quoteId: this.selectedQuote.quoteId,
		};
		this.displayDialog = true;
	}

	save() {
		console.log('entry', this.newEntry);
		const rows = [... this.quoteRows];
		if (this.newEntry) {
			console.log('selectedRow', this.selectedRow);
			this.quoteService.createQuoteRow(this.selectedRow).then(response => {
				const index = this.quoteRows.findIndex(quote => quote === this.selectedRow);
				this.quoteRows[index].quoteRowId = response.insertId;
				console.log('selectedRow', this.quoteRows);
			});
			rows.push(this.selectedRow);
		} else {
			const index = this.quoteRows.findIndex(quote => quote === this.selectedRow);
			rows[index] = this.selectedRow;
			this.quoteService.updateQuoteRow(this.selectedRow);
		}
		this.quoteRows = rows;
		this.displayDialog = false;
	}

	delete() {
		const index = this.quoteRows.findIndex(quote => quote === this.selectedRow);
		this.quoteRows = this.quoteRows.filter((val, i) => i !== index);
		this.quoteService.deleteQuoteRow(this.selectedRow);
		this.selectedRow = null;
		this.displayDialog = false;
	}
	/*
	
		cloneCar(c: Car): Car {
			let car = new PrimeCar();
			for (let prop in c) {
				car[prop] = c[prop];
			}
			return car;
		}
	
		findSelectedCarIndex(): number {
			return this.cars.indexOf(this.selectedCar);
		}*/

}
