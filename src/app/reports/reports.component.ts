import { Component, OnInit } from '@angular/core';
import {Member} from '../members/member';
import {MemberNJSService} from "../members/memberNJS.service";


@Component({
  selector: 'app-reports',
  providers: [MemberNJSService],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(private ms: MemberNJSService) { }

  memberlist: Array<Member>;
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
    //return (ln < rn) ? -1 : (ln > rn) ? 1: 0;
    if (ln < rn) return -1;
    if (ln > rn) return 1; else return 0;
  }
  ngOnInit() {

    this.ms.getAllDocs().subscribe(r1 => {
      //this.memberlist = r1;
      /*for (let em of r1) {
       if (em.payments != null)
       em.payments = em.payments.sort((l, r) => {
       if (l.receivedDate < r.receivedDate) return 1;
       if (l.receivedDate > r.receivedDate) return -1; else return 0;
       });
       }*/
      this.memberlist = r1.sort(this.compareMember);

    });
  }

}
