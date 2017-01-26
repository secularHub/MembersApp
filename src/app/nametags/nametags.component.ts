import { Component, OnInit } from '@angular/core';
import {Member} from '../members/member';
import {Router}   from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-nametags',
  templateUrl: './nametags.component.html',
  styleUrls: ['./nametags.component.css']
})
export class NametagsComponent implements OnInit {

  router: Router;
  app: AppComponent;
  
  memberlist: Array<Member>;
  member: Member;

  isPreview: boolean = false;
  logoUrl: string = "/assets/images/cropped-faceboook-logo-whole-hub-e1454810467184.png";

  constructor(private r: Router, private a: AppComponent) {
    this.router = r;
    this.app = a;
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
