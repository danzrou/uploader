import { InjectionToken } from '@angular/core';

export interface UploaderFileConfig {
	maxSize: string; // 10kb, 5mb ...
	extensions: string[]; // [".png", ".jpg"] or ["*"] for all file types
}

export interface AppConfig {
	uploads: {
		[type: string]: UploaderFileConfig;
	};
}

export const CONFIG = new InjectionToken<AppConfig>('AppConfig');
