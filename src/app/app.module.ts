import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UploaderModule } from './uploader/uploader.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UploaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
