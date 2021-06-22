import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortname',
})
export class ShortnamePipe implements PipeTransform {
  transform(name: any, ...args: any[]): string {
    if(name === undefined)
      return "";
    var sepratedName = name.split(' ');
    return sepratedName[0]
      .charAt(0)
      .toString()
      .concat(sepratedName[1] ? sepratedName[1].charAt(0) : '')
      .toUpperCase();
  }
}
