import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { StagingAreaComponent } from './staging-area/staging-area.component';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import {
	TabViewModule, DataListModule, DialogModule, ButtonModule, DropdownModule, SelectButtonModule,
	PanelModule, CalendarModule
} from 'primeng/primeng';
import { ModelModule } from './model/model.module';
import { CrmModule } from './crm/crm.module';

@NgModule({
	declarations: [
		AppComponent,
		StagingAreaComponent
	],
	imports: [
		ModelModule,
		CrmModule,
		TabViewModule,
		CalendarModule,
		PanelModule,
		SelectButtonModule,
		DataListModule,
		TabViewModule,
		BrowserModule,
		DragulaModule,
		DialogModule,
		ButtonModule,
		DropdownModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
