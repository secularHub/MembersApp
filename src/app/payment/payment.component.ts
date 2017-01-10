import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {IPayment, Payment} from './payment';
import {Member} from "../members/member";

//import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({

  selector: 'as-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  constructor(){
    if(this.payments == null || this.payments.length === 0){
      this.pay =  {receivedDate: new Date(), amount: 0, type: "cash", targetDate: new Date(), active: false, receivedDateNumeric : 0};
    }
    else {
      this.pay = this.payments[0];
    }
    this.showInputs = false;
    this.showList = false;
    this.isShowAddNew = true;
    this.isShowDelete = false;
    this.isShowSubmit = false;
    this.isShowDiscard = false;

  }
  //todo add setter for members

  @Input('member')
  set member(m: Member){
    let p = m.payments;
    this.lmember = m;
    this.showInputs = false;
    this.isShowAddNew = true;
    this.isShowDelete = false;
    this.isShowSubmit = false;
    this.isShowDiscard = false;
    if(p != null && p.length > 0) {
      this.showList = true;
      this.pmts = p.sort((l,r) => {if (l.receivedDate < r.receivedDate) return 1; if(l.receivedDate > r.receivedDate) return -1; else return 0;});
    }
    this.pmts = p;
    this.payments = p;
  }
  get member(): Member{
    return this.lmember;
  }
  @Output() OnSaved = new EventEmitter<boolean>();
  @Output() OnPayModified = new EventEmitter<boolean>();
  lmember: Member;
  payments: Array<IPayment>;
  ecol: string;
  pay: IPayment;
  showInputs: boolean;
  showList: boolean;
  isShowDelete: boolean;
  isShowAddNew: boolean;
  isShowSubmit: boolean;
  isShowDiscard: boolean;

  receivedDateFormatted: string;
  datetry: any;
  usermode: string;
  private pmts: Array<IPayment>;

  set humanDate(e){
    let ee = e.split('/');
    let d = new Date(Date.UTC(Number(ee[0]), Number(ee[1])-1, Number(ee[2])));
    this.pay.receivedDate = d;
  }
  get humanDate(){
    if(this.pay != null) {
      let d = new Date(this.pay.receivedDate.valueOf());
      return d.toISOString().substring(0, 10);
    }
  }
  submitForm() {
      /*this.Delete(this.payd);  //referenced saved for possible deletes
      this.payments.push(this.pay);*/
      this.isShowAddNew = true;
      this.isShowSubmit = false;
      this.isShowDiscard = false;
      this.isShowDelete = false;
      this.showInputs = false;
      this.payments = this.payments.sort((l,r) => {if (l.receivedDate < r.receivedDate) return 1; if(l.receivedDate > r.receivedDate) return -1; else return 0;});
      this.OnSaved.emit(true);
      if (this.pmts != null && this.pmts.length > 0)
        this.showList = true;
  }

  Delete(p: Payment){
    let index = this.payments.indexOf(p, 0);
    if (index > -1) {
      this.payments.splice(index, 1);
    }
  }

  onDelete(){
    this.Delete(this.pay);
    this.isShowAddNew = true;
    this.isShowSubmit = false;
    this.isShowDiscard = false;
    this.isShowDelete = false;
    this.showInputs = false;
    this.OnSaved.emit(true);
  }


  onAdd(){
    this.pay =  {receivedDate: new Date(), amount: 0, type: "cash", targetDate: new Date(), active: false, receivedDateNumeric: 0};
    this.payments.push(this.pay);
    this.payments = this.payments.sort((l,r) => {if (l.receivedDate < r.receivedDate) return 1; if(l.receivedDate > r.receivedDate) return -1; else return 0;});

    this.isShowAddNew = false;
    this.isShowSubmit = true;
    this.isShowDiscard = true;
    this.isShowDelete = false;
    this.showInputs = true;
    if(this.lmember.index == null)
      this.lmember.index++;
    this.OnPayModified.emit(true);
  }
  onDiscard(){

    this.showInputs = false;
    this.isShowAddNew = true;
    this.isShowSubmit = false;
    this.isShowDiscard = false;
    this.isShowDelete = false;


  }
  public onPaymentTable(pay :IPayment){
    this.pay = pay;
    this.showInputs = true;
    this.isShowAddNew = true;
    this.isShowSubmit = true;
    this.isShowDiscard = true;
    this.isShowDelete = true;
    this.OnPayModified.emit(true);


  }
  ngOnInit(){

    /*for(let p of this.payments)
     {
     let d = new Date(p.receivedDate.valueOf());
     p.receivedDateNumeric = Number(d.getFullYear() + d.getUTCMonth() + d.getUTCDay());
     }
     this.payments = this.payments.sort((l,r) => {if (l.receivedDate < r.receivedDate) return 1; if(l.receivedDate > r.receivedDate) return -1; else return 0;});*/
    //this.receivedDateFormatted = this.pay.receivedDate.toISOString().substring(0, 10);
    /*
     for (let p of this.payments)
     {
     let d = new Date(p.receivedDate.valueOf());
     p.receivedDateString = d.toISOString();
     }
     */
  }
}


/**
 * Created by fox21 on 12/18/2016.
 */
