import {Component, OnInit, Input} from '@angular/core';

import {Member} from './member';
import {IPayment } from '../payment/payment'
import {PaymentComponent} from '../payment/payment.component';
import {Router}   from '@angular/router';
import {MemberNJSService} from "./memberNJS.service";
import {rules} from "./config";
import {MaintenanceComponent} from "../maintenance/maintenance.component";

//import {EmsComponent} from "./ems.component";


//import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({

  selector: 'as-member',
  providers: [MemberNJSService,PaymentComponent],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  @Input()
  from: string;


  member: Member;
  picked: Member;
  memberd: Member;
  showInputs: boolean;
  payments: Array<IPayment>;
  memberlist: Array<Member>;
  membercount: number;
  activecount: number;
  vipcount: number;

  saveResults: string;
  router: Router;
  btnstyle:string;
  isShowSubmit: boolean;
  isShowAddNewMember: boolean;
  isShowAddFamily: boolean;
  isShowDiscard: boolean;
  isShowToggleVIP: boolean;
  isShowRefresh: boolean;

  familyFilter: boolean;
  activeFilter: boolean;
  VIPFilter: boolean;
  nametagFilter: boolean;
  firstNameFilter: string;
  lastNameFilter: string;
  selected: boolean;
  usermode: string;
  tempid: string;
  tempName: string;
  bug: string;
  private list: Member[];
  private memservice: MemberNJSService;
  private maintservice: MaintenanceComponent;
//  private payservice: PaymentComponent;

  private showCompleted: Boolean;
  logoUrl: string = "/assets/images/cropped-faceboook-logo-whole-hub-e1454810467184.png";

  //  memberlist: FirebaseListObservable<any[]>;
  constructor(private r: Router, private ms: MemberNJSService) {
    this.router = r;
    this.btnstyle = "btn-custom";
    this.memservice = ms;
    this.showCompleted = true;
    this.membercount = 0;
    this.firstNameFilter = "";
    this.lastNameFilter = "";
    this.activeFilter = false;
    this.selected = true;
    this.usermode = "normal";
//    this.isShowAddFamily = false;
//    this.isShowSubmit = true;
//    this.isShowDiscard = false;
//    this.isShowToggleVIP = true;
    this.isShowRefresh = true;
    this.isShowAddNewMember = true;
//    this.showInputs = true;

    //    this.memberlist = af.database.list('./members');
  }

  getPayments(): Array<IPayment> {
    if (this.payments == null)
      this.payments = new Array<IPayment>();
    return this.payments;
  }

  getMember(): Member { /*don't think this is being used */
    return this.member;
  }

  private replaceMemberInList(m: Member)
  {
    let temp: Member;
    for (let obj of this.memberlist)
    {
      if(obj._id === this.member._id) {
        temp = obj;
      }
    }
    this.Delete(temp);
    this.memberlist.push(m);
    this.sort();
  }

  onResponse(s: string) {
    this.saveResults = s;
  }

  submitForm() {
    if (this.hasChanges()) {
      this.isShowAddFamily = true;
      this.isShowSubmit = true;
      this.isShowDiscard = false;
      this.isShowToggleVIP = true;
      this.showInputs = true;
      this.usermode = "normal";
      this.saveResults = "Member changes saved!";

      this.btnstyle = "btn-custom";
  //    this.Delete(this.memberd);  /*referenced saved for possible deletes*/

      this.replaceMemberInList(this.member);
      this.picked = this.member;

      if (this.member._id == null || this.member._id.length === 0)
        this.member._id = this.member.firstName + this.member.lastName + this.member.email;
        this.membercount = this.memberlist.length;
        this.memservice.saveMember(this.member).subscribe((saveRes => {
        this.member._rev = saveRes._rev;
      }));
    }
    else
      this.saveResults = "No changes, save not required!";
  }

  Delete(p: Member) {
    let index = this.memberlist.indexOf(p, 0);
    if (index > -1) {
      this.memberlist.splice(index, 1);
    }
  }
  /* delMember(i: number) {
   let res: string;
   this.memberlist[i].delete();
   }*/

  onAddFamily() {
    this.saveResults = "";
    this.tempid = this.member._id;
    this.tempName = this.member.firstName + ' ' + this.member.lastName;
    this.member = new Member('', false);
    this.member.parentID = this.tempid;
    this.member.parentName = this.tempName;
    this.member.isFamily = true;
    this.btnstyle = "btn-custom";
    this.isShowDiscard = true;
    this.isShowSubmit = true;
    this.isShowAddNewMember = false;
    this.isShowToggleVIP = false;
    this.showInputs = true;
    this.usermode = 'normal';
  }

  onRefresh() {
    if (!this.hasChanges()) {
      this.saveResults = "";
      this.ngOnInit();
    }
    else
      this.onUsingTable(this.member);
  }

  onToggleVIP() {
    if (this.member.memType != "VIP") {
      this.member.isActive = true;
      this.member.memType = "VIP";
    }
    else {
      let tnow = new Date();
      let thist = this.memservice.addMonths(tnow, -12);
      if (this.member.payments != null) {
        let total = 1;
        for (let mypay of this.member.payments) {
          if(mypay.receivedDate != undefined) {
            if (new Date(mypay.receivedDate) > thist)
              total = total + mypay.amount;
           }
        }
        for (let r of rules) {
           if (total > r.Amount) {
             this.member.memType = r.MembershipType;
          }
        }
        if (this.member.memType === "Not Active")
          this.member.isActive = false;
        else
          this.member.isActive = true;
      }
      else {
        this.member.memType = "Not Active";
        this.member.isActive = false;
      }
    }
  }

  /*
   onEdit() {
   this.usermode = 'screenMember';
   }
   onAdd() {
   this.member = new Member('', false);
   this.usermode = 'screenMember';
   }
   */

  onSave(m: Member) {
      this.member = m;
      this.memservice.saveMember(this.member).subscribe((saveRes => {
        this.member._rev = saveRes._rev;
        this.ms.getDoc(m._id).subscribe(m => {
          this.member = Object.assign({}, m);
          this.picked = m;
          this.replaceMemberInList(this.member);

        });
      }));


  }

  onPayModified(b: boolean){
    this.saveResults = "";
    if(this.member.index == null) {
      this.member.index = 0;
    }
    this.member.index++;
  }

  onAddNewMember() {
    if (!this.hasChanges()) {
      this.saveResults = "";
      this.btnstyle = "btn-custom";
      this.isShowDiscard = true;
      this.isShowSubmit = true;
      this.isShowAddFamily = false;
      this.isShowToggleVIP = false;
      this.showInputs = true;
      this.picked = new Member('', false);  //set placeholder
      this.member = new Member('', false);
      this.usermode = 'normal';
    }
    else
      this.onUsingTable(this.member);
  }

  isChecked(b: boolean)
  {
    if(b)
      return "Y";
    else
      return "N";
  }

  onDiscardMember() {
    this.saveResults = "";
    this.btnstyle = "btn-custom";
    this.usermode = 'normal';
    this.isShowAddFamily = true;
    this.isShowSubmit = true;
    this.isShowDiscard = false;
    this.isShowToggleVIP = true;
    this.selected = true;
    this.showInputs = true;

    this.saveResults = "";
    this.ngOnInit();
  }

  private hasChanges(): boolean {
    if (JSON.stringify(this.member) === JSON.stringify(this.picked))
      return false;
    else
      return true;
  }

  public onUsingTable(al: Member) {
    //add logic to check user's changes
    if (!this.hasChanges()) {
      this.btnstyle = "btn-custom";
      this.ms.getDoc(al._id).subscribe(m => {
        this.member = Object.assign({}, m);
        this.picked = m;
        this.replaceMemberInList(this.member);

      });
/*      this.member = Object.assign({}, al);
/*      for(let i = 0; i < al.payments.length; i++)
      {
        this.member.payments.push(Object.assign({},al.payments[i]));
      }*/
//      this.memberd = al;
//      this.picked = al;
      this.saveResults = "";
      if (this.picked.isFamily === false)
        this.isShowAddFamily = true;
      this.payments = this.member.payments;
      this.selected = true;
      this.isShowSubmit = true;
      this.showInputs = true;
      this.isShowAddFamily = !al.isFamily;
      this.isShowToggleVIP = true;
      this.isShowDiscard = false;
    }
    else{
      this.btnstyle = "btn-red";
      this.isShowDiscard = true;
      this.isShowSubmit = true;
      this.isShowAddFamily = false;
      this.isShowToggleVIP = false;
      this.showInputs = true;
    }
  }

  private sort(){
    this.memberlist = this.memberlist.sort(this.compareMember);
  }

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

  /* ngOnDestroy(){
   localStorage.setItem('members', JSON.stringify(this.memberlist));
   localStorage.setItem('members', JSON.stringify(new Date().getTime()));
   }*/

  ngOnInit() {
    let jwt = localStorage.getItem('id_token');
    if(jwt.length == 0)
      this.router.navigate(['']);

    let res: string;
    //Here we do the initial call to get all of the id's from the database.
    //we are making the assumption that the data is in  a format we can use. validation is not yet implemented
    this.memberlist = new Array<Member>();
/*    if (this.from === 'extended')  //from means user is coming from extendedMembers component so we don't have to go out to the server and recollect the data.
    {
      res = localStorage.getItem('members');
      if (res != null && res.indexOf('phone') > 0) {
        this.from = 'extended';  //because local storage failed somehow
      }
      else {
        this.memberlist = new Array<Member>();
        this.member = new Member('', false);
      }
    }
    if (this.from !== 'extended') {*/
      this.ms.getAllDocs().subscribe(r1 => {
        this.memberlist = r1.sort(this.compareMember);

        this.activecount = 0;
        this.vipcount = 0;
        for(let o of this.memberlist){
          if (o.isActive === true)
            this.activecount += 1;
          if(o.memType === "VIP")
            this.vipcount += 1;
        }
        this.membercount = this.memberlist.length;

      });
      this.member = new Member('', false);
      this.picked = this.member;
      this.onAddNewMember();

//    }
  }
}
