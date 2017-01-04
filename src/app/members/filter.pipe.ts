import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash';

import { Member } from './member';

@Pipe({
  name: 'asFilter'
})
export class FilterPipe implements PipeTransform {
  transform(mems: Member[], active: boolean,family: boolean, firstName: string, lastName: string): Member[] {
    let newmems = mems;
    if(active) {
      newmems = filter(mems, {active});
    }
    if(family) {
      newmems = filter(mems, {family});
    }
    if(firstName != null && firstName.length > 0)
    {
      let mems2 = new Array<Member>();
      for(let al of newmems){
        if(al.firstName != null && al.firstName.length > 0) {
          if(al.firstName.toLowerCase().indexOf(firstName.toLowerCase()) === 0)
            mems2.push(al);

        }
      }
      newmems = mems2;
    }
    if(lastName != null && lastName.length > 0)
    {
      let mems2 = new Array<Member>();
      for(let al of newmems){
        if(al.lastName != null && al.lastName.length > 0) {
          if(al.lastName.toLowerCase().indexOf(lastName.toLowerCase()) === 0)
            mems2.push(al);

        }
      }
      newmems = mems2;
    }
    return newmems;
  }
}

