import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dobToAge',
})
export class DobToAgePipePipe implements PipeTransform {

  transform(value: string): number {
    return +new Date().getFullYear() - +new Date(value).getFullYear();
  }

}
