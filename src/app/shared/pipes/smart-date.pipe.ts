import { Pipe, PipeTransform } from '@angular/core';
import { format, isToday, isYesterday } from 'date-fns';

@Pipe({
  name: 'smartDate',
})
export class SmartDatePipe implements PipeTransform {
  transform(
    value: Date | string | number,
    dateFormat: string = 'MMMM d'
  ): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (isToday(date)) {
      return format(date, 'HH:mm');
    }

    if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    }

    return `${format(date, dateFormat)}, ${format(date, 'HH:mm')}`;
  }
}