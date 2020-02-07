import { Component } from '@angular/core';
import { UploaderErrorType } from './uploader/upload-toaster-error-data.interface';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'uploader';

	onUploadError(error: { type: UploaderErrorType; msg: string }) {}

  onFileLoaded(file: File) {
		console.log(file);
  }
}
