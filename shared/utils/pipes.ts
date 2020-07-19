import {Pipe, PipeTransform} from '@angular/core';
import {Util} from './util';


@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], args: any[], val: any): any[] {
    let fields: string[];
    let value: string;

    if (args) {
      fields = args;
      value = val;
    }
    if (!items) {
      return [];
    }
    //  if(!value || value.length < 3) return [];
    return items.filter(it => {
        if (typeof (value) !== 'string') {
          return;
        }
        if (value && value !== '') {
          for (let item of fields) {
            if (item.indexOf('.') > 0) {
              let splitItems = item.split('.');
              if (splitItems.length == 2) {
                if (it[splitItems[0]][splitItems[1]].toString().toLowerCase().indexOf(value.toLowerCase()) > -1) {
                  return true;
                }
              } else {
                return true;
              }
              // if(it[splitItems[0]] === 'Object'){

            } else {
              if (it[item] && it[item].toString() && it[item].toString().toLowerCase().indexOf(value.toLowerCase()) > -1) {
                return true;
              }
            }


          }
        } else {
          return true;
        }
        return false;

      }
    );
  }
}

