import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { EpicDbDatasource } from '../datasources/epic-db.datasource';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class QuoteService {

	constructor(private datasource: EpicDbDatasource) { }

	getQuoteRows(quoteId: any): Promise<any> {
		return this.datasource.getData(`read/QuoteRows/quoteId/${quoteId}`);
	}

	getQuotes(): Promise<any> {
		return this.datasource.getData('read/QuoteView');
	}

	getQuote(column: string, parameter: any) {
		return this.datasource.getData(`read/QuoteView/${column}/${parameter}`);
	}

	createQuote(quote: any) {
		return this.datasource.postData(`create/Quote`, quote);
	}

	updateQuote(quoteId: number, quote: any) {
		return this.datasource.putData(`update/Quote/quoteId/${quoteId}`, quote);
	}

	getPdf(quoteId: number): Promise<any> {
		return this.datasource.getData(`pdf/${quoteId}`, true)
			.then(res => {
				console.log('get pdf', res);
				return new Blob([res.blob()], { type: 'application/pdf' });
			});
	}

	updateQuoteRow(quoteRow: any): Promise<any> {
		return this.datasource.putData(`update/QuoteRows/quoteRowId/${quoteRow.quoteRowId}`, quoteRow);
	}

	createQuoteRow(quoteRow: any): Promise<any> {
		return this.datasource.postData(`create/QuoteRows/`, quoteRow);
	}

	deleteQuoteRow(quoteRow: any): Promise<any> {
		return this.datasource.deleteData(`delete/QuoteRows/quoteRowId/${quoteRow.quoteRowId}`);
	}
}
