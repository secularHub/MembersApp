import {Component, OnInit, Input} from '@angular/core';

import {Member} from './member';
import {IPayment } from '../payment/payment'
import {PaymentComponent} from '../payment/payment.component';
import {ActivatedRoute, Params, Router}   from '@angular/router';
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

  payments: Array<IPayment>;
  //ems: Array<ExtendedMember>;
  memberlist: Array<Member>;
  membercount: number;

  router: Router;
  btnstyle:string;
  isShowSubmit: boolean;
  isShowAddNewMember: boolean;
  isShowAddFamily: boolean;
  isShowDiscard: boolean;

  familyFilter: boolean;
  activeFilter: boolean;
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
    //
    this.btnstyle = "btn-custom";
    this.Delete(this.memberd);  //referenced saved for possible deletes
    this.memberlist.push(this.member);
    this.picked = this.member;
    this.memberlist = this.memberlist.sort((left, right) => {
      let ln: string;
      let rn: string;
      if (left.firstName != null) {
        ln = left.firstName.toLowerCase();
      }
      else ln = "";

      if (right.firstName != null) {
        rn = right.firstName.toLowerCase();
      }
      else rn = "";
      //return (ln < rn) ? -1 : (ln > rn) ? 1: 0;
      if (ln < rn) return -1;
      if (ln > rn) return 1; else return 0;
    });
    this.memservice.putDoc(this.member);
    this.isShowAddNewMember = true;
    this.isShowAddFamily = false;
    this.isShowSubmit = false;
    this.isShowDiscard = false;
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
    this.usermode = 'normal';
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
  onSave(b: boolean) {
    console.log("emitted from output");
    this.memservice.putDoc(this.member);
  }
  onAddNewMember() {
    this.isShowSubmit = true;
    this.isShowAddNewMember = false;
    this.isShowAddFamily = false;
    this.isShowDiscard = true;
    this.picked = new Member('', false);  //set placeholder
    this.member = new Member('', false);
    this.usermode = 'normal';

  }

  onDiscardMember() {
    this.btnstyle = "btn-custom";
    this.usermode = 'normal';
    this.isShowAddNewMember = true;
    this.isShowAddFamily = false;
    this.isShowSubmit = false;
    this.isShowDiscard = false;
    if (this.picked != null)
      this.member = this.picked;
    else
      this.member = new Member('', false);
    this.selected = false;
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
      this.member = Object.assign({}, al);
      this.memberd = al;
      this.picked = al;
      if (this.picked.isFamily === false)
        this.isShowAddFamily = true;
//        this.ems = this.member.ExtendedMembers;
      this.payments = this.member.payments;
      this.selected = true;
      this.isShowSubmit = true;
      this.isShowAddFamily = !al.isFamily;
      this.isShowAddNewMember = true;
    }
    else{
      this.btnstyle = "btn-red";
      this.isShowDiscard = true;
      this.isShowSubmit = true;
      this.isShowAddFamily = false;
      this.isShowAddNewMember = false;
    }


  }

  /* ngOnDestroy(){
   localStorage.setItem('members', JSON.stringify(this.memberlist));
   localStorage.setItem('members', JSON.stringify(new Date().getTime()));
   }*/
  ngOnInit() {
    let res: string;
    this.isShowAddNewMember = true;
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

        for (let em of r1) {
          if (em.payments != null)
            em.payments = em.payments.sort((l, r) => {
              if (l.receivedDate < r.receivedDate) return 1;
              if (l.receivedDate > r.receivedDate) return -1; else return 0;
            });
        }
        this.memberlist = r1.sort((left, right) => {
          let ln: string;
          let rn: string;
          if (left.firstName != null) {
            ln = left.firstName.toLowerCase();
          }
          else ln = "";

          if (right.firstName != null) {
            rn = right.firstName.toLowerCase();
          }
          else rn = "";
          if (ln < rn) return -1;
          if (ln > rn) return 1; else return 0;
        });


      });
      this.member = new Member('', false);
      this.picked = this.member;
      this.membercount = this.memberlist.length;


    }
  }
}
