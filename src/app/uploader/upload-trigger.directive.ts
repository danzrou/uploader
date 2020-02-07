import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[appUploadTrigger]'
})
export class UploadTriggerDirective {
	constructor(public elRef: ElementRef) {}

	get nativeElement() {
		return this.elRef.nativeElement;
	}
}
