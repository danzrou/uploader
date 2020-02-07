import {
	AfterContentInit,
	Component,
	ContentChildren,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostBinding,
	HostListener,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { humanFileSize, toBoolean, toFileSize } from '../utils';
import { UploadTriggerDirective } from './upload-trigger.directive';
import { UploaderConfigurationFactory } from './uploader-configuration.factory';
import { UploaderFileTypeEnum } from './uploader-file-type.enum';
import { UploaderConfiguration } from './uploader.config';

const ALL_FILE_TYPES = '*';

@Component({
	selector: 'app-uploader',
	templateUrl: './uploader.component.html',
	styleUrls: ['./uploader.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		UploaderConfigurationFactory,
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => UploaderComponent),
			multi: true
		}
	]
})
export class UploaderComponent
	implements
		OnInit,
		AfterContentInit,
		OnChanges,
		OnDestroy,
		ControlValueAccessor {
	@Input() maxSize: string;
	@Input() accept: string;

	@Input() multiple = false;
	@Input() controlName = 'file';

	@Input() fileType: UploaderFileTypeEnum;
	@Input() module: string;

	@Input()
	set disabled(disabled: boolean) {
		this._disabled = toBoolean(disabled);
	}

	get disabled() {
		return this._disabled;
	}

	@Output() readonly formDataLoaded = new EventEmitter<FormData>();
	@Output() readonly fileLoaded = new EventEmitter<File>();
	@Output() readonly fileListLoaded = new EventEmitter<FileList>();

	@Output() readonly errorOnFileSize = new EventEmitter<string>();
	@Output() readonly errorOnFileType = new EventEmitter<string>();

	@HostBinding('class.tn-uploader')
	baseClass = true;

	@ViewChild('fileInput', { static: true })
	fileInput: ElementRef;

	@ContentChildren(UploadTriggerDirective)
	trigger: QueryList<UploadTriggerDirective>;

	uploaderConfiguration: UploaderConfiguration;

	private _maxSize: number;
	private _file: File | null = null;
	private _disabled: boolean;
	private _triggerSub: Subscription;
	private destroy$ = new Subject();

	onChange: Function = () => {};
	onTouched: Function = () => {};

	constructor(
		private host: ElementRef,
		private readonly uploaderConfigFactory: UploaderConfigurationFactory
	) {}

	get element() {
		return this.fileInput.nativeElement as HTMLInputElement;
	}

	ngOnInit() {
		this.setUploaderConfigurations();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!!changes.maxSize || !!changes.accept || changes.module) {
			this.setUploaderConfigurations();
		}
	}

	ngAfterContentInit() {
		this.subscribeToTrigger();
		this.subscribeToTriggerChanges();
	}

	ngOnDestroy() {}

	@HostListener('change', ['$event.target.files'])
	uploadFile(event: FileList): void {
		if (event.length) {
			if (this.isExtensionAcceptable(event)) {
				this.proceedUpload(event);
			} else {
				this.element.value = '';
				this.errorOnFileType.emit('The file type is not supported');
			}
		}
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {}

	writeValue(obj: any): void {
		if (this.fileInput) {
			this.element.value = '';
		}
		this._file = null;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	openFileBrowser(): void {
		this.element.click();
	}

	private proceedUpload(event: FileList) {
		const formData = new FormData();
		if (this.multiple) {
			this.fileListLoaded.emit(event);
		} else {
			const file = event.item(0);
			this.onChange(file);
			if (file.size > this._maxSize) {
				this.errorOnFileSize.emit(
					`File size must be under ${humanFileSize(this._maxSize)}.`
				);
			} else {
				formData.append(this.controlName, file, event[0].name);
				this.formDataLoaded.emit(formData);
				this.fileLoaded.emit(file);
				this._file = file;
			}

			this.element.value = '';
		}
	}

	private isExtensionAcceptable(event: FileList): boolean {
		if (!this.accept || this.accept === ALL_FILE_TYPES) {
			return true;
		} else {
			const files = Array.from(event);
			return !files.some(
				file =>
					!this.accept.toLowerCase().includes(
						file.name
							.split('.')
							.pop()
							.toLowerCase()
					)
			);
		}
	}

	private subscribeToTriggerChanges() {
		this.trigger.changes.pipe(takeUntil(this.destroy$)).subscribe(changes => {
			this._triggerSub && this._triggerSub.unsubscribe();
			if (changes.first) {
				this.subscribeToTrigger();
			}
		});
	}

	private subscribeToTrigger() {
		const triggers = this.trigger.toArray();
		if (triggers.length === 0) {
			throw Error('You must supply a trigger for uploader');
		}

		this._triggerSub = fromEvent<MouseEvent>(triggers[0].nativeElement, 'click')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => this.openFileBrowser());
	}

	private setUploaderConfigurations() {
		this.setUploaderConfig();
		this.setFileSizeAndExt();
	}

	private setUploaderConfig() {
		if (this.fileType !== undefined) {
			this.uploaderConfiguration = this.uploaderConfigFactory
				.setModuleName(this.module)
				.setFileType(this.fileType)
				.getConfiguration();
		} else {
			this.setConfigFromInputs();
		}
	}

	private setConfigFromInputs() {
		const defaultConfig = this.uploaderConfigFactory.getDefaultConfiguration();
		defaultConfig.maxSize = this.maxSize
			? toFileSize(this.maxSize)
			: defaultConfig.maxSize;
		defaultConfig.accept = this.accept || defaultConfig.accept;
		this.uploaderConfiguration = defaultConfig;
	}

	private setFileSizeAndExt() {
		const { maxSize, accept } = this.uploaderConfiguration;
		this._maxSize = maxSize;
		this.accept = accept;
	}
}
