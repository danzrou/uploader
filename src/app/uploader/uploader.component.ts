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
	@Input() disabled: boolean;
	@Input() accept: string;
	@Input() multiple = false;
	@Input() fileType: string;

	@ViewChild('fileInput', { static: true })
	fileInput: ElementRef;

	@ContentChild(UploadTriggerDirective, { static: false })
	trigger: UploadTriggerDirective;

	@Output() fileLoaded = new EventEmitter();
	@Output() fileError = new EventEmitter();

	private file: File | null = null;
	private config: UploaderFileConfig;
	private destroy$ = new Subject();

	onChange: Function = () => {};
	onTouched: Function = () => {};

	constructor(private manager: UploaderConfigManager) {}

	get element() {
		return this.fileInput.nativeElement as HTMLInputElement;
	}

	@HostListener('change', ['$event.target.files'])
	onFileChanges(event: FileList) {
		if (event.length) {
			const file = event.item(0);
			if (this.isValidFile(file)) {
				this.file = file;
				this.onChange(file);
				this.fileLoaded.emit(file);
			} else {
				this.file = null;
				this.element.value = '';
			}
		}
	}

	ngOnInit() {
		this.config = this.manager.getConfigByFileType(this.fileType);
		this.accept = this.accept || this.config.extensions.join(', ');
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
		this.file = null;
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

	private isValidFile(file: File) {
		const { size, name } = file;
		if (!this.manager.hasValidExtension(this.config, name)) {
			this.fileError.emit({
				type: 'extension',
				message: 'The file type is not supported'
			});
			return false;
		} else if (!this.manager.hasValidSize(this.config, size)) {
			this.fileError.emit({
				type: 'size',
				message: `File size needs to be up to ${this.config.maxSize}`
			});
			return false;
		}

		return true;
	}
}
