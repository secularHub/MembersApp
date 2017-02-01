import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Member } from '../members/member';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { MemberNJSService } from "../members/memberNJS.service";

@Component({
  selector: 'app-nametags',
  templateUrl: './nametags.component.html',
  styleUrls: ['./nametags.component.css'],
  providers: [ MemberNJSService ]
})
export class NametagsComponent implements OnInit {
  member: Member;
  memberlist: Array<Member>;
  rows: Array<NametagsComponent.Row>;

  topSlider : number = 0.0;
  leftSlider : number = 0.0;
  nudgeSlider : number = 0.0;

  // TODO: Make the logo URL configurable in some way.
  logoUrl: string = "/assets/images/cropped-faceboook-logo-whole-hub-e1454810467184.png";

  constructor(
    private router: Router, 
    private memservice: MemberNJSService, 
    private app: AppComponent) {
      // empty
  }

  ngOnInit() {
    this.navigateToRootWhenNotLoggedIn();
    this.populateMemberList();
    this.isPreview = false;
  }

  ngOnDestroy() {
    this.isPreview = false;
  }

  onClickTable(member: Member) {
    //alert("onClickTable: " + member.firstName + ", " + member.lastName)
  }

  // isPreview property
  private _isPreview: boolean = false;
  get isPreview(): boolean {
    return this._isPreview;
  }
  set isPreview(value: boolean) {
    let needsUpdate : boolean = (this._isPreview === false && value === true);

    this._isPreview = value;
    this.app.setMenuHidden(this._isPreview);

    if (needsUpdate) {
      // Set the default 'nudge' value (after waiting for preview page to load).
      setTimeout(() => {
        let margin = $('.nametags-firstname').css( 'marginTop' );
        let value: number = parseFloat(margin)/96;    // px to in (pixels to inches)
        this.nudgeSlider = this.changeSlider(this.nudgeSlider, value, -2, 2, 0.1, 0);
        }
        , 100);
    }
  }  


  changedTop(value: number) {
    $('.nametags-page').animate({marginTop: '' +this.topSlider + 'in'}, 100);
  }
  incTop(value: number) {
    this.topSlider = this.changeSlider(this.topSlider, this.topSlider + value, -2, 2, 0.1, 0);
    this.changedTop(this.topSlider);
  }
  topSliderChange(event) {
    this.topSlider = this.changeSlider(this.topSlider, event.target.value, -2, 2, 0.1, 0);
    this.changedTop(this.topSlider);
  }

  changedLeft(value: number) {
    $('.nametags-page').animate({marginLeft: '' +this.leftSlider + 'in'}, 100);
  }
  incLeft(value: number) {
    this.leftSlider = this.changeSlider(this.leftSlider, this.leftSlider + value, -2, 2, 0.1, 0);
    this.changedLeft(this.leftSlider);
  }
  leftSliderChange(event) {
    this.leftSlider = this.changeSlider(this.leftSlider, event.target.value, -2, 2, 0.1, 0);
    this.changedLeft(this.leftSlider);
  }

  changedNudge(value: number) {
    $('.nametags-firstname').animate({marginTop: '' +this.nudgeSlider + 'in'}, 100);
  }
  incNudge(value: number) {
    this.nudgeSlider = this.changeSlider(this.nudgeSlider, this.nudgeSlider + value, -2, 2, 0.1, 0);
    this.changedNudge(this.nudgeSlider);
  }
  nudgeSliderChange(event) {
    this.nudgeSlider = this.changeSlider(this.nudgeSlider, event.target.value, -2, 2, 0.1, 0);
    this.changedNudge(this.nudgeSlider);
  }

  changeSlider(original, value, min: number, max: number, step: number, defaultValue: number): number {
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

  toRange(value, min: number, max: number, step: number, defaultValue: number): number {
    if (isNaN(value)) value = defaultValue;
    let result: number = parseFloat(value);

    if (result < min) result = min;
    if (result > max) result = max;

    let low: number = Math.floor(result/step)*step;
    if ( (result-low) < (low+step-result)) {
      result = low;
    }
    else {
      result = low+step;
    }
    result = Math.round(result*1000)/1000;
    return result;
  }


  // TODO: This is common code (with routines elsewhere in app).  Needs to be merged.
  navigateToRootWhenNotLoggedIn() {
    let jwt = localStorage.getItem('id_token');
    if(jwt.length == 0)
      this.router.navigate(['']);
  }

  private populateMemberList(){
    this.memberlist = new Array<Member>();
    this.memservice.getAllDocs().subscribe(response => {
        this.memberlist = response.sort(this.compareMember);
        this.memberlist = this.memberlist.filter(
            member => member.needsNametag === true
        );

        // this.fillMemberListFromSamples();  // only for initial testing
        this.fillPreviewFromMemberList();
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
  //   this.fillPreviewFromMemberList();
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
    return member.firstName.length + member.lastName.length === 0;
  }

  toYN(value) {
    return value===true ? "Y" : "N";
  }

}

// Make Row an inner class of NametagsComponent
export module NametagsComponent {
  export class Row {
    public cols: Array<Member> = new Array<Member>();
  }
}
