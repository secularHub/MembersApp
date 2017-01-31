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
  justforspacing: string;
  mailinglabelallReport: string;
  mailinglabelactiveReport: string;
  allemailReport: string;
  activeemailReport: string;
  eoytaxReport: string;
  isShowEmail: boolean;
  isShowSave: boolean;
  isShowPrint: boolean;
  isShowGenerate: boolean;

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

  onSelEmail(){
    this.isShowEmail = true;
    this.isShowSave = true;
    this.isShowPrint = true;
    this.isShowGenerate = false;
    this.justforspacing = "Emailed is not working yet"
  }

  onSelSave(){
    this.isShowEmail = true;
    this.isShowSave = true;
    this.isShowPrint = true;
    this.isShowGenerate = false;
    this.justforspacing = "Save is not working yet"
  }

  onSelPrint(){
    this.isShowEmail = true;
    this.isShowSave = true;
    this.isShowPrint = true;
    this.isShowGenerate = false;
    this.justforspacing = "Print is not working yet"
  }

  onMailingLabelAll(){
    this.ms.getAllDocs().subscribe(r1 => {
      this.memberlist = r1.sort(this.compareMember);
    });
//    alert("you selected Mailing Label report for All members")
    this.isShowEmail = true;
    this.isShowSave = true;
    this.isShowPrint = true;
    this.isShowGenerate = false;
    this.justforspacing = "Select Delivery Meathod"
  }

  ngOnInit() {
    this.justforspacing = "Reports Page";
    this.isShowGenerate = true;
  }

}
