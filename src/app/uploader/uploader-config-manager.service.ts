import { Inject, Injectable } from '@angular/core';
import { AppConfig, CONFIG, UploaderFileConfig } from './uploader.config';

const ALL_FILE_TYPES = '*';

@Injectable({
	providedIn: 'root'
})
export class UploaderConfigManager {
	constructor(@Inject(CONFIG) protected config: AppConfig) {}

	getConfigByFileType(type: string): UploaderFileConfig {
		return this.byFileType(type) || this.defaultConfig();
	}

	private byFileType(type: string) {
		return this.config.uploads && this.config.uploads[type];
	}

	private defaultConfig() {
		return {
			maxSize: '100mb',
			extensions: [ALL_FILE_TYPES]
		};
	}
}
