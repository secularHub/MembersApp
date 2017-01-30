import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {Member} from '../members/member';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {MemberNJSService} from "../members/memberNJS.service";

@Component({
  selector: 'app-nametags',
  templateUrl: './nametags.component.html',
  styleUrls: ['./nametags.component.css'],
  providers: [ MemberNJSService ]

})
export class NametagsComponent implements OnInit {
  @Output() onTopChanged = new EventEmitter<number>();
  @Output() onLeftChanged = new EventEmitter<number>();
  @Output() onNudgeChanged = new EventEmitter<number>();

  private router: Router;
  private app: AppComponent;
  private memservice: MemberNJSService;
  
  member: Member;
  memberlist: Array<Member>;
  rows: Array<NametagsComponent.Row>;

  topSlider : number = 0.0;
  leftSlider : number = 0.0;
  nudgeSlider : number = 0.0;

  isPreview: boolean = false;
  logoUrl: string = "/assets/images/cropped-faceboook-logo-whole-hub-e1454810467184.png";

  constructor(private r: Router, private ms: MemberNJSService, private a: AppComponent) {
    this.router = r;
    this.memservice = ms;
    this.app = a;
  }

  changedTop(value:number) {
    this.onTopChanged.emit(value);
  }
  changedLeft(value:number) {
    this.onLeftChanged.emit(value);
  }
  changedNudge(value:number) {
    this.onNudgeChanged.emit(value);
  }

  incTop(value:number) {
    this.topSlider = this.changeSlider(this.topSlider, this.topSlider + value, -2, 2, 0.1, 0);
    this.changedTop(this.topSlider);
  }
  incLeft(value:number) {
    this.leftSlider = this.changeSlider(this.leftSlider, this.leftSlider + value, -2, 2, 0.1, 0);
    this.changedLeft(this.leftSlider);
  }
  incNudge(value:number) {
    this.nudgeSlider = this.changeSlider(this.nudgeSlider, this.nudgeSlider + value, -2, 2, 0.1, 0);
    this.changedNudge(this.nudgeSlider);
  }

  topSliderChange(event) {
    this.topSlider = this.changeSlider(this.topSlider, event.target.value, -2, 2, 0.1, 0);
    this.changedTop(this.topSlider);
  }
  leftSliderChange(event) {
    this.leftSlider = this.changeSlider(this.leftSlider, event.target.value, -2, 2, 0.1, 0);
    this.changedLeft(this.leftSlider);
  }
  nudgeSliderChange(event) {
    this.nudgeSlider = this.changeSlider(this.nudgeSlider, event.target.value, -2, 2, 0.1, 0);
    this.changedNudge(this.nudgeSlider);
  }

  changeSlider(original, value ,min:number, max:number, step:number, defaultValue:number):number {
    let result: number;
    let newValue: number = this.toRange(value, -2, 2, 0.1, 0);
    if (isNaN(original)) {
      original = defaultValue;
    }
    
    /* NaN */
    if (isNaN(value)) {
      result = newValue;
    }
    /* changed */
    else if (Math.abs(parseFloat(original) - newValue) > 0.0000001) {
      result = newValue;
    }
    /* same */
    else {
      result = parseFloat(original);
    }
    return result;
  }

  toRange(value, min:number, max:number, step:number, defaultValue:number):number {
    if (isNaN(value)) value = defaultValue;
    let result: number = parseFloat(value);

    if (result < min) result = min;
    if (result > max) result = max;

    let low:number = Math.floor(result/step)*step;
    if ( (result-low) < (low+step-result)) {
      result = low;
    }
    else {
      result = low+step;
    }
    result = Math.round(result*1000)/1000;
    return result;
  }

  ngOnInit() {
    this.navigateToRootWhenNotLoggedIn();
    this.populateMemberList();
    this.setPreview(false);
  }

  ngOnDestroy() {
    this.setPreview(false);
  }

  /* Use this method to change isPreview.  DO NOT change this.isValue directly. */
  setPreview(value: boolean) {
    //if (value !== this.isPreview) {
      this.isPreview = value;
      this.app.setMenuHidden(this.isPreview);
    //}
  }

  onPreview() {
    this.setPreview(true);
  }

  onExitPreview() {
    this.setPreview(false);
  }

  navigateToRootWhenNotLoggedIn() {
    let jwt = localStorage.getItem('id_token');
    if(jwt.length == 0)
      this.router.navigate(['']);
  }

  private populateMemberList(){
    this.memberlist = new Array<Member>();
    this.ms.getAllDocs().subscribe(response => {
        this.memberlist = response.sort(this.compareMember);
        this.memberlist = this.memberlist.filter(
            member => member.needsNametag === true
        );

        this.fillPreviewFromMemberList();
        // this.fillMemberListFromSamples();  // only for initial testing
      });
  }

  // fillMemberListFromSamples() {
  //   let sampleMembers = [
  //     {first: "Abe", last: "Arturo"},
  //     {first: "Bob", last: "Brandon"},
  //     {first: "Carl", last: "Crackin"},
  //     {first: "Donny", last: "Dringle"},
  //     {first: "Eve", last: "Easter"},
  //     {first: "Fran", last: "Flynn"}
  //   ];
  //   let sampleMembersLong = [
  //     {first: "Zed", last: "Zilby"},
  //     {first: "Honeyblossum", last: "Zomi-Freaktastic"},
  //     {first: "Ooo. Long Longoooo", last: "Forkulator"},
  //     {first: "Ooo. Long Longoooo", last: "Perkinator Z"},
  //     {first: "Blingie", last: "Richardson"},
  //     {first: "Thomas", last: "Thompson"}
  //   ];

  //   this.memberlist = new Array<Member>();
  //   for (let m of sampleMembers) {
  //     let member: Member = new Member('', false);
  //     member.firstName = m.first;
  //     member.lastName = m.last;
  //     member.needsNametag = true;
  //     this.memberlist.push(member);
  //   }
  //   this.fillRowsFromMemberList();
  // }

  fillPreviewFromMemberList() {
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

  public isNameTagBlank(member: Member) {
    return member.firstName.length + member.lastName.length !== 0;
  }

  onClickTable(member: Member) {
    //alert("onClickTable: " + member.firstName + ", " + member.lastName)
  }

  toYN(value) {
    return value===true ? "Y" : "N";
  }

}

export module NametagsComponent {
  export class Row {
    public cols: Array<Member> = new Array<Member>();
  }
}
