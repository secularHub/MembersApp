import { Component, OnInit } from '@angular/core';
import {Member} from '../members/member';
import {Router}   from '@angular/router';

@Component({
  selector: 'app-nametags',
  templateUrl: './nametags.component.html',
  styleUrls: ['./nametags.component.css']
})
export class NametagsComponent implements OnInit {

  router: Router;
  
  memberlist: Array<Member>;
  member: Member;

  isShowPreview: boolean = false;
  logoUrl: string = "/assets/images/cropped-faceboook-logo-whole-hub-e1454810467184.png";

  constructor(private r: Router) {
    this.router = r;
  }

  ngOnInit() {
    this.navigateToRootWhenNotLoggedIn();

    this.populateMemberListWithSampleData();

    this.isShowPreview = false;
  }

  navigateToRootWhenNotLoggedIn() {
    let jwt = localStorage.getItem('id_token');
    if(jwt.length == 0)
      this.router.navigate(['']);
  }

  onPreview() {
    this.isShowPreview = true;
  }

  onExitPreview() {
    this.isShowPreview = false;
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
