import {Component,  OnInit} from '@angular/core';

import { IPayment} from '../payment/payment';
import {Member} from '../members/member';
import {Router}   from '@angular/router';

import {MemberNJSService} from "../members/memberNJS.service";
import {rules} from "../members/config";
import {isNullOrUndefined} from "util";

@Component({

  selector: 'as-maintenance',
  providers: [MemberNJSService],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {
  router: Router;
  member: Member;
  payments: Array<IPayment>;
  //ems: Array<ExtendedMember>;
  memberlist: Array<Member>;
  ms: MemberNJSService;
  payloop = [];
  forloop = [];
  elseloop = [];

  temp: string;
  filterName: string;
  constructor(private r: Router, private lms: MemberNJSService){
    this.router = r;
    this.ms = lms;
  }
  /*    private addDays(date: Date, days: number): Date {
   console.log('adding ' + days + ' days');
   console.log(date);
   date.setDate(date.getDate() + parseInt(days));
   console.log(date);
   return date;
   }*/
  public addMonths (date, count):Date {
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
    let thist = this.addMonths(tnow, -12);
    this.ms.getAllDocs().subscribe(r1 => {
      this.memberlist = r1;
      for (let res2 of this.memberlist) {
        this.forloop.push(res2);
        let member = Object.assign({}, res2);
//        if(member.memType == undefined)
//          member.memType = "Not Active";
        if (member.memType === "VIP") {
          member.isActive = true;
        }
        else {
          member.isActive = false;
          if (member.payments != null && member.payments.length > 0) {
            let total = 1;
            this.payloop.push(member);
            for (let mypay of member.payments) {
              if(mypay.receivedDate != undefined) {
                if (new Date(mypay.receivedDate) > thist)
                  total = total + mypay.amount;
              }
            }
            for (let r of rules) {
              if (total > r.Amount) {
                member.isActive = true;
                this.elseloop.push(member);
                member.memType = r.MembershipType;
              }
            }
            if (member.memType === "Not Active")
              member.isActive = false;
          }
        }
//        if (member.memType === undefined)
//          member.memType = "Not Active";
        this.ms.putDoc(member);
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
    let jwt = localStorage.getItem('id_token');
    if(jwt.length == 0)
      this.router.navigate(['']);
      
    this.temp = '';
  }
}
