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
  memberlist: Array<Member>;
  ms: MemberNJSService;
  payloop = [];
  forloop = [];
  elseloop = [];

  notifyMessage: string;
  isShowRemoveFamily: boolean;
  isShowDeleteMember: boolean;
  firstNameFilter: string;
  lastNameFilter: string;
  familyFilter: boolean;
  activeFilter: boolean;
  VIPFilter: boolean;
  nametagFilter: boolean;

  temp: string;
  filterName: string;
  logoUrl: string = "/assets/images/cropped-faceboook-logo-whole-hub-e1454810467184.png";

  constructor(private r: Router, private lms: MemberNJSService){
    this.router = r;
    this.ms = lms;
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
//  private m: Member;
  private reconcile() {
    this.notifyMessage = "This will take a while! Done once you can navigate again.";
    let tnow = new Date();
    let thist = this.ms.addMonths(tnow, -12);
    this.ms.getAllDocs().subscribe(r1 => {
      this.memberlist = r1;
      for (let res2 of this.memberlist) {
        this.forloop.push(res2);
        let member = Object.assign({}, res2);
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
        this.ms.putDoc(member);
      }
    });
/*Need to figure out how to determine when the database is ready again, then clear the message and sort
    this.notifyMessage = "";
    this.populateMemberList();*/
  }

  isChecked(b: boolean)
  {
    if(b)
      return "Y";
    else
      return "N";
  }

  public onUsingTable ( al: Member) { /* This is for the control table */
    if(event.target["id"] === "filter") {
      this.temp = '';
    }
    if(event.target["id"] === "reconcile") {
      this.reconcile();
    }

  }

  onClickTable(member: Member) { /* This is for the membership table */
  }

  onDeleteMember() { /* This is for the membership table */
  }

  onRemoveFamily() { /* This is for the membership table */
  }

  private populateMemberList(){
    this.memberlist = new Array<Member>();
    this.ms.getAllDocs().subscribe(response => {
        this.memberlist = response.sort(this.compareMember);
//        this.memberlist = this.memberlist.filter(
//            member => member.needsNametag === true
//    });

//        this.fillPreviewFromMemberList();
      });
  }

/*&  fillPreviewFromMemberList() {
    this.rows = new Array<NametagsComponent.Row>();

    let row = 0;
    let col = 0;
    for (let index = 0; index < 6; index++) {
      row = Math.floor(index/2);
      col = index % 2;
      if (row >= this.rows.length) {
        this.rows.push(new NametagsComponent.Row());
      }
      this.rows[row].cols[col] =
        (index < this.memberlist.length)
        ? Object.assign({}, this.memberlist[index])                          // shallow clone
        : Object.assign(new Member('', false), {firstName:'',lastName:''});  // new empty member
    }
  }
*/
  private compareMember(left, right){
    let ln: string;
    let rn: string;
    if (left.firstName != null && left.lastName != null) {
      ln = left.firstName.toLowerCase() + left.lastName.toLowerCase();
    }
    else
      ln = "";
    if (right.firstName != null && right.lastName != null) {
      rn = right.firstName.toLowerCase() + right.lastName.toLowerCase();
    }
    else rn = "";
    if (ln < rn) return -1;
    if (ln > rn) return 1; else return 0;
  }

  ngOnInit(){
    let jwt = localStorage.getItem('id_token');
    if(jwt.length == 0)
      this.router.navigate(['']);
      
    this.temp = '';

    this.isShowDeleteMember = true;
    this.isShowRemoveFamily = true;
    this.notifyMessage = "";
    this.populateMemberList();
  }
}
