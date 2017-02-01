import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  providers: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './members/members.component.css']
})
export class AppComponent implements OnInit{

  title: string;
  login: boolean;
  jwt: string;
  isMenuHidden: boolean = false;
  outletText : string;

  constructor(public router: Router) {
    this.login = true;
    this.outletText="hidden";
  }

  ngOnInit(){
    this.title ='Secular Hub Members';
    localStorage.setItem('id_token', '');
    this.router.navigate(['/login']);
  }

  onLoginSuccess(){
    this.login = false;
    this.outletText = "";
    this.routeToMembers();
  }

  public setMenuHidden(value: boolean) {
    this.isMenuHidden = value;
  }

  // TODO: Consider having other code use these to do navigation,
  // or find where they need to go to share them.
  // Or, delete them entirely.
  routeToMembers(){
    this.routeToSecuredPage('/members');
  }
  routeToMaintenance(){
    this.routeToSecuredPage('/maintenance');
  }
  routeToNameTags(){
    this.routeToSecuredPage('/nametags');
  }
  routeToReports(){
    this.routeToSecuredPage('/reports');
  }

  routeToSecuredPage(route: string) {
    this.jwt = localStorage.getItem('id_token');
    if(this.jwt.length > 0)
    {
      this.router.navigate([route]);
    }
  }

}
