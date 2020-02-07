import { Inject, Injectable } from '@angular/core';
import { AppConfig, ClientFileConfig, CONFIG } from '../config/config';
import { toFileSize } from '../utils';
import { UploaderFileTypeEnum } from './uploader-file-type.enum';
import { UploaderConfiguration } from './uploader.config';

@Injectable()
export class UploaderConfigurationFactory {
	private fileType: UploaderFileTypeEnum;
	private moduleName: string;

	get defaultMaxSize(): string {
		return this.config.general.uploads.attachment.maxSize;
	}

	constructor(@Inject(CONFIG) protected config: AppConfig) {}

	setModuleName(moduleName: string): this {
		this.moduleName = moduleName;
		return this;
	}

	setFileType(fileType: UploaderFileTypeEnum): this {
		this.fileType = fileType;

		return this;
	}

	getConfiguration(): UploaderConfiguration {
		if (!this.fileType) {
			this.throwFileTypeMissingError();
		}

		return this.parseToUploaderConfiguration(
			this.config[this.moduleName].uploads[this.fileType]
		);
	}

	getDefaultConfiguration(): UploaderConfiguration {
		return this.parseToUploaderConfiguration(
			this.config.general.uploads.attachment
		);
	}

	private parseToUploaderConfiguration(
		clientFileConfig: ClientFileConfig
	): UploaderConfiguration {
		return {
			maxSize: toFileSize(clientFileConfig.maxSize),
			accept: clientFileConfig.extensions.join(', ')
		};
	}

	private throwFileTypeMissingError(): Error {
		throw new Error(`
			fileType: UploaderFileTypeEnum -> is not provided;
			Example:
				this.uploaderConfigFactory.setFileType(filetype)
		`);
	}
}
