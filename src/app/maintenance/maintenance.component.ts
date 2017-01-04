import {Component,  OnInit} from '@angular/core';

import { IPayment} from '../payment/payment';
import {Member} from '../members/member';

import {MemberNJSService} from "../members/memberNJS.service";
import {rules} from "../members/config";

@Component({

  selector: 'as-maintenance',
  providers: [MemberNJSService],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {
  member: Member;
  payments: Array<IPayment>;
  //ems: Array<ExtendedMember>;
  memberlist: Array<Member>;
  ms: MemberNJSService;
  temp: string;
  filterName: string;
  constructor(private lms: MemberNJSService){
    this.ms = lms;
  }
  /*    private addDays(date: Date, days: number): Date {
   console.log('adding ' + days + ' days');
   console.log(date);
   date.setDate(date.getDate() + parseInt(days));
   console.log(date);
   return date;
   }*/
  private addMonths (date, count):Date {
    if(date == null)
      return new Date();
    let nd: Date;
    if (date && count) {
      nd = new Date(date);

      if(count === 12) {
        nd.setFullYear(nd.getFullYear() + 1);
      }
      else {
        if(nd.getMonth() === 11)
        {
          nd.setMonth(0,1);
          nd.setFullYear(nd.getFullYear() + 1);
        }
        nd.setMonth(nd.getMonth() + count, 1);
      }

    }
    return nd;
  }
  getLastPayment(ps: Array<IPayment>) : IPayment
  {
    let last : IPayment;
    last = ps[0];
    let inx = 0;
    for(let pp of ps)
    {
      if(inx > 0)
      {
        if(ps[inx].receivedDate > ps[inx-1].receivedDate)
          last = ps[inx];
      }
      inx  = inx + 1;
    }
    return last;

  }
  private m: Member;
  private reconcile() {
    let tnow = new Date();
    this.ms.getAllDocs().subscribe(r1 => {
      this.memberlist = r1;
      for (let res2 of this.memberlist) {
        this.m = res2;
        if (this.m.payments != null && this.m.payments.length > 0) {
          let pay = this.getLastPayment(this.m.payments);
          if (pay.amount < rules.recuringAmount) {
            this.m.frequency = 1;
            this.m.targetDate = this.addMonths(pay.receivedDate, 1);
            pay.targetDate = this.m.targetDate;
          }
          else {
            this.m.frequency = 12;
            this.m.targetDate = this.addMonths(pay.receivedDate, 12);
            pay.targetDate = this.m.targetDate;
          }

          if (this.m.targetDate > tnow) {
            this.m.active = true;
          }
          else this.m.active = false;
        }
        else {
          this.m.active = false;
        }
        this.ms.putDoc(this.m);
      }
    });
  }


  private doConvert(){
    this.ms.getAllDocs().subscribe(r1 => {
      this.memberlist = r1;
      for (let res2 of this.memberlist) {
        let m = new Member(res2.email, false);
        m.address = res2.address;
        m._id = res2._id;
        m.city = res2.city;
        m.state = res2.state;
        m.zip = res2.zip;
        m.payments = new Array<IPayment>();
        m.email = res2.email;
        m.firstName = res2.firstName;
        m.lastName = res2.lastName;
        if (res2.payments != null && res2.payments.length > 0) {
          for (let p of res2.payments) {
            let pay: IPayment;
            pay = {
              receivedDate: p.receivedDate,
              amount: p.amount,
              type: '',
              active: false,
              targetDate: undefined,
              receivedDateNumeric: 0
            };
            m.payments.push(pay);
          }
        }
        this.ms.putDoc(m);
      }
    });

  }
  public onUsingTable ( al: Member) {
    if(event.target["id"] === "filter") {
      this.temp = '';
    }
    if(event.target["id"] === "reconcile") {
      this.reconcile();
    }

  }
  ngOnInit(){
    this.temp = '';
  }
}
