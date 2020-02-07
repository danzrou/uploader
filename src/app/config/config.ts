import { InjectionToken } from '@angular/core';

export interface ClientUploadConfig {
	[key: string]: ClientFileConfig;
}

export interface ClientFileConfig {
	maxSize: string;
	extensions: string[];
}

export interface AppConfig {
	[key: string]: {
		uploads: ClientUploadConfig;
	};
}

export const CONFIG = new InjectionToken<AppConfig>('AppConfig');
