import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DialogModule, ButtonModule, DropdownModule } from 'primeng/primeng';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		DialogModule,
		ButtonModule,
		BrowserAnimationsModule,
		DropdownModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
