import { Inject, Injectable } from '@angular/core';
import { toFileSize } from '../utils';
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

	hasValidExtension(config: UploaderFileConfig, fileName: string) {
		if(config.extensions.includes(ALL_FILE_TYPES)) {
			return true;
		}
		
		const extension = fileName.split('.')[1].toLowerCase();
		return config.extensions.some(ext => ext.includes(extension));
	}

	hasValidSize(config: UploaderFileConfig, size: number) {
		const maxSize = toFileSize(config.maxSize);
		return maxSize > size;
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
