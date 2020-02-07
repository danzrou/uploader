import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	error;
	file;

	onFileLoaded(file: File) {
		console.log(file);
		this.error = null;
		this.file = { name: file.name, size: file.size };
	}

	onFileError(error) {
		this.file = null;
		this.error = error;
	}
}
