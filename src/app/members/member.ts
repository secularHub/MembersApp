
import {IPayment} from "../payment/payment";
export class Member {

  index: number;
  _id: string;
  _rev: string;
  parentID: string;
  parentName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  createdAt: number;
  joinedDate: Date;
  completed: boolean;
  active: boolean;
  frequency: number;
  skills: string;
  durationmonths: number;
  targetDate: Date;
  Description: string;
  Notes: string;
  isFamily: boolean;
  //ExtendedMembers: Array<ExtendedMember>;
  payments: Array<IPayment>;

  constructor(email: string, done = false) {
    this.email = email;
    this.completed = done;
    this.joinedDate = new Date();
    this.payments = new Array<IPayment>();
    this.frequency = 12;  //frequency of payments in months
    // members.push(this);
    // this.key = members.length;
  }
  public delete(){
    this.active = false;

  }

  public clear() {
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.address = '';
    this.city = '';
    this.state = '';
    this.zip = '';
    this.completed = false;
  }
}

