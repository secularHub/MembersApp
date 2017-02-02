import { Component,EventEmitter, OnInit, AfterViewInit, ViewChild, ViewChildren, Output } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
//import { AuthHttp } from 'angular2-jwt';
import { contentHeaders } from '../common/headers';
import { confignjs} from '../members/config';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['..//members/members.component.css']
})

export class LoginComponent implements OnInit, AfterViewInit {

  @Output() OnLoginSuccess = new EventEmitter<boolean>();
  @ViewChildren('username') vc;
  someData: string;

  constructor(public router: Router, public http: Http) {
    // empty
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.vc.first.nativeElement.focus();
  }

  login(event, username, password) {
    event.preventDefault();
    let h = confignjs.hostlocal;
    this.someData="init:";
    let body = JSON.stringify({ username, password });
    this.http.post(h + '/sessions/login', body, { headers: contentHeaders })
      .subscribe(
        response => {
          localStorage.setItem('id_token', response.json().id_token);
          this.someData="ok";
          this.OnLoginSuccess.emit(true);

        },
        error => {

          this.someData = "error: " + error.text();
          console.log(error.text());
        }
      );
  }
}
