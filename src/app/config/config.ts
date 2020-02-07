import { InjectionToken } from '@angular/core';

export interface UploaderAppConfig {
	maxSize: string; // 10kb, 5mb ...
	extensions: string[]; // [".png", ".jpg"] or ["*"] for all file types
}

export interface UploadFileConfig {
	maxSize: number;
	accept: string;
}

export const CONFIG = new InjectionToken<UploaderAppConfig>('AppConfig');
