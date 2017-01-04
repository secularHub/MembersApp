import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {IPayment, Payment} from './payment';

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
    this.paymode = "";
    this.usermode = "normal";
    this.ecol = "3";
  }
  //todo add setter for members

  @Input()
  payments: Array<IPayment>;
  @Output() OnSaved = new EventEmitter<boolean>();

  ecol: string;
  pay: IPayment;
  payd: IPayment;
  paymode: string;
  receivedDateFormatted: string;
  datetry: any;
  usermode: string;
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

    if(this.paymode === "Add") {
      console.log('adding');
      this.payments.push(this.pay);
    }
    else{
      this.Delete(this.payd);
      this.payments.push(this.pay);
    }
    this.payments = this.payments.sort((l,r) => {if (l.receivedDate < r.receivedDate) return 1; if(l.receivedDate > r.receivedDate) return -1; else return 0;});
    this.pay = new Payment();
    this.paymode = "Add";
    this.usermode = "normal";
    this.OnSaved.emit(true);
    this.ecol = "3";


  }
  Delete(p: Payment){
    let index = this.payments.indexOf(p, 0);
    if (index > -1) {
      this.payments.splice(index, 1);
    }
  }
  onDelete(){
    let pay = this.pay;
    let index = this.payments.indexOf(pay, 0);
    if (index > -1) {
      this.payments.splice(index, 1);
    }
  }

  onEdit(){
    this.usermode = 'edit';
    this.ecol = "8";
  }
  onAdd(){
    this.pay =  {receivedDate: new Date(), amount: 0, type: "cash", targetDate: new Date(), active: false, receivedDateNumeric: 0};
    this.usermode = 'edit';
    this.ecol = "8";
  }
  onDiscard(){
    this.usermode = 'normal';
    this.pay =  {receivedDate: new Date(), amount: 0, type: "cash", targetDate: new Date(), active: false, receivedDateNumeric: 0};
  }
  public onPaymentTable(pay :IPayment){
    this.pay = Object.assign({}, pay);
    this.payd = pay;
    this.paymode= "Save";
  }
  ngOnInit(){
    this.paymode = "Add";
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
