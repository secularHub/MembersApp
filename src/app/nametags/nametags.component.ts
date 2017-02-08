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

  tagsPerPage: number = 6;

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
    if (jwt.length == 0) {
      this.router.navigate(['']);
    }
  }

  private populateMemberList(){
    this.memberlist = new Array<Member>();
    this.memservice.getAllDocs().subscribe(response => {
      this.memberlist = response.sort(this.compareMember);
      this.memberlist = this.memberlist.filter(
        member => member.needsNametag === true
      );
    });
  }

  pageTop(page: number): number {
    return 1+page*11;     // inches
  }
  numPages(): number {
    return  (this.memberlist.length <= 0)
      ? 0
      : 1 + Math.trunc((this.memberlist.length - 1) / this.tagsPerPage );
  }
  indexes(length: number) {
    // return array of length n containing 0..n-1
    let a: Array<number> = new Array<number>(length);
    for (let i=0; i<a.length; i++) {
      a[i] = i;
    }
    return a;
  }

  getMemberByIndex(index: number): Member {
    // returns clone of indicated member, or (when out of range) a new empty member.
    return (0 <= index && index < this.memberlist.length)
        ? Object.assign({}, this.memberlist[index])                          // shallow clone
        : Object.assign(new Member('', false), {firstName:'',lastName:''});  // new empty member
  }
  getIndex(page: number, row: number, col: number): number {
    return page*this.tagsPerPage + row*2 + col;
  }
  getMember(page: number, row: number, col: number): Member {
    return this.getMemberByIndex(this.getIndex(page, row, col));
  }

  // compareMember is common code.  Should be in Member class.
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
