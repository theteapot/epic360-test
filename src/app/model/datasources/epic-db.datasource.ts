import { NgModule, Injectable, Inject, OpaqueToken } from '@angular/core';
import { Http, Request, RequestMethod, ResponseContentType } from '@angular/http';
import { MySQLResponse } from '../interfaces/mysql-response.interface';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export const REST_URL = new OpaqueToken('rest_url');

@Injectable()
export class EpicDbDatasource {
	constructor(private http: Http, @Inject(REST_URL) private url: string) { }

	getData(ext: string, blob?: boolean): Promise<any> {
		return this.sendRequest(RequestMethod.Get, `${this.url}/${ext}`, '', blob).toPromise();
	}

	putData(ext: string, body: any): Promise<any> {
		return this.sendRequest(RequestMethod.Put, `${this.url}/${ext}`, body).toPromise();
	}

	deleteData(ext: string): Promise<any> {
		return this.sendRequest(RequestMethod.Delete, `${this.url}/${ext}`).toPromise();
	}

	postData(ext: string, body: any): Promise<any> {
		return this.sendRequest(RequestMethod.Post, `${this.url}/${ext}`, body).toPromise();
	}

	private sendRequest(verb: RequestMethod, url: string, body?: any, blob?: boolean): Observable<any> {

		return this.http.request(new Request({
			responseType: blob ? ResponseContentType.Blob : ResponseContentType.Json,
			method: verb,
			url: url,
			body: body
		})).map(res => blob ? res : res.json());
	}
}
