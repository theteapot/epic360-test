import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DialogModule, ButtonModule, DropdownModule } from 'primeng/primeng';
import { StagingAreaComponent } from './staging-area/staging-area.component';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { TabViewModule, DataListModule } from 'primeng/primeng';
import { ModelModule } from './model/model.module';

@NgModule({
	declarations: [
		AppComponent,
		StagingAreaComponent,
	],
	imports: [
		ModelModule,
		TabViewModule,
		DataListModule,
		TabViewModule,
		BrowserModule,
		DragulaModule,
		DialogModule,
		ButtonModule,
		BrowserAnimationsModule,
		DropdownModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
