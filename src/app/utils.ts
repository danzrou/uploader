import * as fileSizeParser from 'filesize-parser';

export function toBoolean(val: any): boolean {
  return typeof val === 'string' ? val.toLowerCase().trim() !== 'false' : !!val;
}

export function toFileSize(value: string, base: number = 10): number {
  return fileSizeParser(value, { base });
}

export function humanFileSize(bytes: number, si: boolean = true) {
  let _bites = bytes;
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${_bites} B`;
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    _bites /= thresh;
    ++u;
  } while (Math.abs(_bites) >= thresh && u < units.length - 1);

  return `${_bites.toFixed(1)} ${units[u]}`;
}
