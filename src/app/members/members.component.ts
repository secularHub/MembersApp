import {Component, OnInit, Input} from '@angular/core';

import {Member} from './member';
import {IPayment } from '../payment/payment'
import {PaymentComponent} from '../payment/payment.component';
import {Router}   from '@angular/router';
import {MemberNJSService} from "./memberNJS.service";

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
  //ems: Array<ExtendedMember>;
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

  familyFilter: boolean;
  activeFilter: boolean;
  VIPFilter: boolean;
  firstNameFilter: string;
  lastNameFilter: string;
  selected: boolean;
  usermode: string;
  tempid: string;
  tempName: string;
  bug: string;
  private list: Member[];
  private memservice: MemberNJSService;
  private showCompleted: Boolean;

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
    this.selected = false;
    this.usermode = "normal";

    //    this.memberlist = af.database.list('./members');
  }

  getPayments(): Array<IPayment> {
    if (this.payments == null)
      this.payments = new Array<IPayment>();
    return this.payments;
  }

  getMember(): Member {
    return this.member;
  }
  /*
   getExtended(): Array<ExtendedMember>{
   if(this.ems == null)
   this.ems = new Array<ExtendedMember>();
   return this.ems;
   }
   */

  submitForm() {
    //let m = new Member('',false);
    this.btnstyle = "btn-custom";
//    this.Delete(this.memberd);  /*referenced saved for possible deletes*/

    let found = false;
    let temp: Member;
    for (let obj of this.memberlist)
    {
      if(obj._id === this.member._id) {
        found = true;
        temp = obj;
      }
    }
    this.Delete(temp);
    this.memberlist.push(this.member);

    this.picked = this.member;
    this.memberlist = this.memberlist.sort((left, right) => {
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
      //return (ln < rn) ? -1 : (ln > rn) ? 1: 0;
      if (ln < rn) return -1;
      if (ln > rn) return 1; else return 0;
    });
    if (this.member._id == null || this.member._id.length === 0)
      this.member._id = this.member.firstName + this.member.lastName + this.member.email;
    this.membercount = this.memberlist.length;
    this.memservice.putDoc(this.member);
    this.memservice.getDoc(this.member._id).subscribe(res =>{
      let doc = res;
      if(doc._rev === this.member._rev)
        this.saveResults = "saved success";
      else
        this.saveResults = "someone beat you to the save. Please reload the record."
    });
    this.isShowAddNewMember = true;
    this.isShowAddFamily = true;
    this.isShowSubmit = true;
    this.isShowDiscard = false;
    this.isShowToggleVIP = true;
    this.showInputs = true;
    this.usermode = "normal";



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
    this.tempid = this.member._id;
    this.tempName = this.member.firstName + ' ' + this.member.lastName;
    this.member = new Member('', false);
    this.member.parentID = this.tempid;
    this.member.parentName = this.tempName;
    this.member.isFamily = true;
    this.isShowDiscard = true;
    this.isShowAddNewMember = false;
    this.isShowSubmit = true;
    this.isShowAddFamily = false;
    this.isShowToggleVIP = true;
    this.usermode = 'normal';
  }

  onToggleVIP() {
    if (this.member.isActive === false) {
      this.member.isActive = true;
      this.member.memType = "VIP"
    }
    else {
      this.member.isActive = false;
      this.member.memType = "Not Active"
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

  onSave(b: boolean) { /* don't think this is being used... */
    //console.log("emitted from output");
    if (!this.hasChanges())
      this.memservice.putDoc(this.member);
    }

  onPayModified(b: boolean){
    if(this.member.index == null) {
      this.member.index = 0;
    }
    this.member.index++;
  }

  onAddNewMember() {
    this.isShowSubmit = true;
    this.isShowAddNewMember = false;
    this.isShowAddFamily = false;
    this.isShowDiscard = true;
    this.isShowToggleVIP = true;
    this.picked = new Member('', false);  //set placeholder
    this.member = new Member('', false);
    this.usermode = 'normal';
    this.showInputs = true;
  }
  isChecked(b: boolean)
  {
    if(b)
      return "Y";
    else
      return "N";
  }

  onDiscardMember() {
    this.btnstyle = "btn-custom";
    this.usermode = 'normal';
    this.isShowAddNewMember = true;
    this.isShowAddFamily = false;
    this.isShowSubmit = false;
    this.isShowDiscard = false;
    this.isShowToggleVIP = false;
    if (this.picked != null)
      this.member = this.picked;
    else
      this.member = new Member('', false);
    this.selected = false;
    this.showInputs = false;
  }

  private hasChanges(): boolean { /*always returns false ?!?!*/
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
        let temp: Member;
        for (let obj of this.memberlist)
        {
          if(obj._id === this.member._id) {
            temp = obj;
          }
        }
        this.Delete(temp);
        this.memberlist.push(this.member);

      });
/*      this.member = Object.assign({}, al);
/*      for(let i = 0; i < al.payments.length; i++)
      {
        this.member.payments.push(Object.assign({},al.payments[i]));
      }*/
//      this.memberd = al;
//      this.picked = al;
      if (this.picked.isFamily === false)
        this.isShowAddFamily = true;
//        this.ems = this.member.ExtendedMembers;
      this.payments = this.member.payments;
      this.selected = true;
      this.isShowSubmit = true;
      this.showInputs = true;
      this.isShowAddFamily = !al.isFamily;
      this.isShowAddNewMember = true;
      this.isShowToggleVIP = true;
    }
    else{
      this.btnstyle = "btn-red";
      this.isShowDiscard = true;
      this.isShowSubmit = true;
      this.isShowAddFamily = false;
      this.isShowAddNewMember = false;
      this.isShowToggleVIP = false;
      this.showInputs = true;
    }
  }
  /* ngOnDestroy(){
   localStorage.setItem('members', JSON.stringify(this.memberlist));
   localStorage.setItem('members', JSON.stringify(new Date().getTime()));
   }*/
  ngOnInit() {
/*    this.bug = "started:"
    this.ms.getProtected('test').subscribe(r => {
      console.log(r);
      this.bug += r
    });*/
    /*let jwt = localStorage.getItem('id_token');
    if(jwt.length === 0)
      this.router.navigate(['']);*/

    let res: string;
    this.isShowAddNewMember = true;
    this.showInputs = false;
    //Here we do the initial call to get all of the id's from the database.
    //we are making the assumption that the data is in  a format we can use. validation is not yet implemented
    this.memberlist = new Array<Member>();
    if (this.from === 'extended')  //from meanse user is coming from extendedMembers component so we don't have to go out to the server and recollect the data.
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
    if (this.from !== 'extended') {
      this.ms.getAllDocs().subscribe(r1 => {
        //this.memberlist = r1;
        /*for (let em of r1) {
          if (em.payments != null)
            em.payments = em.payments.sort((l, r) => {
              if (l.receivedDate < r.receivedDate) return 1;
              if (l.receivedDate > r.receivedDate) return -1; else return 0;
            });
        }*/
        this.memberlist = r1.sort((left, right) => {
          let ln: string;
          let rn: string;
          if (left.firstName != null && left.lastName != null) {
            ln = left.firstName.toLowerCase() + left.lastName.toLowerCase();
          }
          else ln = "";

          if (right.firstName != null && right.lastName != null) {
            rn = right.firstName.toLowerCase() + right.lastName.toLowerCase();
          }
          else rn = "";
          if (ln < rn) return -1;
          if (ln > rn) return 1; else return 0;
        });

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
    }
  }
}
