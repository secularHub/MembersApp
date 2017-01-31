import { Component, OnInit } from '@angular/core';
import {NavbarComponent} from "./navbar/navbar.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  providers: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './members/members.component.css']
})
export class AppComponent implements OnInit{

  constructor(public router: Router) { this.login = true;}

  title: string;
  login: boolean;
  jwt: string;
  isMenuHidden: boolean = false;

  public setMenuHidden(value: boolean) {
    this.isMenuHidden = value;
  }

  onLoginSuccess(){
    this.login = false;
    this.router.navigate(['/members']);
  }

  routeToMembers(){
    this.jwt = localStorage.getItem('id_token');
    if(this.jwt.length > 0)
    {
      this.router.navigate(['/#members']);
    }
  }

  routeToMaintenance(){
    this.jwt = localStorage.getItem('id_token');
    if(this.jwt.length > 0)
    {
      this.router.navigate(['/#maintenance']);
    }
  }

  routeToNameTags(){
    this.jwt = localStorage.getItem('id_token');
    if(this.jwt.length > 0)
    {
      this.router.navigate(['/#nametags']);
    }
  }

  routeToReports(){
    this.jwt = localStorage.getItem('id_token');
    if(this.jwt.length > 0)
    {
      this.router.navigate(['/#reports']);
    }
  }

  ngOnInit(){
    this.title ='Secular Hub Members';
    localStorage.setItem('id_token', '');
    this.router.navigate(['/login']);
  }

}
