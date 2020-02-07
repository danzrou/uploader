import {
	AfterContentInit,
	Component,
	ContentChild,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UploadTriggerDirective } from './upload-trigger.directive';
import { UploaderConfigManager } from './uploader-config-manager.service';
import { UploaderFileConfig } from './uploader.config';

@Component({
	selector: 'app-uploader',
	templateUrl: './uploader.component.html',
	styleUrls: ['./uploader.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => UploaderComponent),
			multi: true
		}
	]
})
export class UploaderComponent
	implements ControlValueAccessor, AfterContentInit, OnDestroy, OnInit {
	get element() {
		return this.fileInput.nativeElement as HTMLInputElement;
	}
	@Input() disabled: boolean;
	@Input() accept: string;
	@Input() multiple = false;
	@Input() fileType: string;

	@ViewChild('fileInput', { static: true })
	fileInput: ElementRef;

	@ContentChild(UploadTriggerDirective, { static: false })
	trigger: UploadTriggerDirective;

	@Output() fileLoaded = new EventEmitter();

	private _file: File | null = null;
	private _config: UploaderFileConfig;
	private destroy$ = new Subject();

	onChange: Function = () => {};
	onTouched: Function = () => {};

	constructor(private manager: UploaderConfigManager) {}

	@HostListener('change', ['$event.target.files'])
	onFileChanges(event: FileList) {
		if (event.length) {
			const file = event.item(0);
			this._file = file;
			this.onChange(file);
			this.fileLoaded.emit(file);
		}
	}

	ngOnInit() {
		this._config = this.manager.getConfigByFileType(this.fileType);
	}

	ngAfterContentInit() {
		this.subscribeToTrigger();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {}

	writeValue(value: any): void {
		if (this.fileInput) {
			this.element.value = '';
		}
		this._file = null;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	openFileBrowser() {
		this.element.click();
	}

	private subscribeToTrigger() {
		if (!this.trigger) {
			throw Error('No trigger was provided for Uploader');
		}

		fromEvent(this.trigger.nativeElement, 'click')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => this.openFileBrowser());
	}
}
