import { Component, OnInit, Input } from '@angular/core';
import { JobService } from '../../model/services/job.service';
import {
	DomSanitizer,
	SafeHtml,
	SafeUrl,
	SafeStyle
} from '@angular/platform-browser';
/* Displays Site Visit Data
 */

@Component({
	selector: 'app-site-visit',
	templateUrl: './site-visit.component.html',
	styleUrls: ['./site-visit.component.css']
})
export class SiteVisitComponent implements OnInit {

	@Input() siteVisit;
	pictures: { data: SafeUrl, description: string }[];

	constructor(private jobSvc: JobService, private dom: DomSanitizer) { }

	ngOnInit() {
		this.jobSvc.getSiteVisitPictures(this.siteVisit.siteVisitId)
			.then(pictures => this.pictures = pictures.map(picture => {
				return {
					data: this.dom.bypassSecurityTrustUrl('data:image/png;base64,' + picture.data),
					description: picture.description
				};
			})
		);
	}

	updateSiteVisit() {

	}

}
