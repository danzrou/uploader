import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadTriggerDirective } from './upload-trigger.directive';
import { UploaderComponent } from './uploader.component';

const UPLOADER_COMPONENTS = [UploaderComponent, UploadTriggerDirective];

@NgModule({
	declarations: [...UPLOADER_COMPONENTS],
	imports: [CommonModule, FormsModule, ReactiveFormsModule],
	exports: [...UPLOADER_COMPONENTS]
})
export class UploaderModule {}
