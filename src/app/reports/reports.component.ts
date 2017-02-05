import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Member} from '../members/member';
import {MemberNJSService} from "../members/memberNJS.service";
import {escape} from "querystring";

@Component({
  selector: 'app-reports',
  providers: [MemberNJSService],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  logoUrl: string = "/assets/images/cropped-faceboook-logo-whole-hub-e1454810467184.png";

  constructor(private ms: MemberNJSService) {
      this.isShowHeader = true;
  }
  //ops: {name: string; display: string;}

  reportOptions = [{name: 'mailinglabelallReport', display:'Mailing Labels for all members'},
    {name: 'mailinglabelactiveReport', display:'Mailing Labels for all ACTIVE members'},
    {name: 'allemailReport', display:'All Member emails, comma delimmited'},
    {name: 'activeemailReport', display:'ACTIVE Member emails, comma delimmited'},
    {name: 'eoytaxReport', display:'End of year Tax Report for all paying members'}  ];

  memberlist: Array<Member>;
  justforspacing: string;
  mailinglabelallReport: string;
  mailinglabelactiveReport: string;
  allemailReport: string;
  activeemailReport: string;
  eoytaxReport: string;
  isShowEmail: boolean;
  isShowHeader: boolean;
  isShowSave: boolean;
  isShowPrint: boolean;
  isShowGenerate: boolean;
  ops: {name: string; display: string;}
  optionStates: Array<string>;

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

  onSelPrint(opsForm: any){

    //do logic based on ops
    if(opsForm.ops.name === this.reportOptions[0].name)
    {
      //logic for mailing label report.
    }
    this.isShowEmail = true;
    this.isShowSave = true;
    this.isShowPrint = true;
    this.isShowGenerate = false;
    this.isShowHeader =false;
    this.justforspacing = "Print is not working yet"
  }

  onKeyUp(key: KeyboardEvent){
    if(key.keyCode === 27) //escape key
      this.isShowHeader = true;
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
