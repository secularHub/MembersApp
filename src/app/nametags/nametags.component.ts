import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {Member} from '../members/member';
import {Router} from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-nametags',
  templateUrl: './nametags.component.html',
  styleUrls: ['./nametags.component.css']
})
export class NametagsComponent implements OnInit {
  @Output() onTopChanged = new EventEmitter<number>();
  @Output() onLeftChanged = new EventEmitter<number>();
  @Output() onNudgeChanged = new EventEmitter<number>();

  router: Router;
  app: AppComponent;
  
  memberlist: Array<Member>;
  member: Member;

  topSlider : number = 0.0;
  leftSlider : number = 0.0;
  nudgeSlider : number = 0.0;

  isPreview: boolean = false;
  logoUrl: string = "/assets/images/cropped-faceboook-logo-whole-hub-e1454810467184.png";

  constructor(private r: Router, private a: AppComponent) {
    this.router = r;
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

    this.populateMemberListWithSampleData();

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

  private populateMemberListWithSampleData(){
    /* TODO: Populate with REAL data from database. */

    let sampleMembers = [
      {first: "Abe", last: "Arturo"},
      {first: "Bob", last: "Brandon"},
      {first: "Carl", last: "Crackin"},
      {first: "Donny", last: "Dringle"},
      {first: "Eve", last: "Easter"},
      {first: "Fran", last: "Flynn"}
    ];

    this.memberlist = new Array<Member>();

    for (let m of sampleMembers) {
      this.member = new Member('', false);
      this.member.firstName = m.first;
      this.member.lastName = m.last;

      this.memberlist.push(this.member);
    }
  }

  onClickTable(member: Member) {
    alert("onClickTable: " + member.firstName + ", " + member.lastName)
  }

  toYN(value) {
    return value===true ? "Y" : "N";
  }

}
