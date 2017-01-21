/**
 * Created by fox21 on 12/30/2016.
 */
import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Member } from './member';
import { confignjs} from './config';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/catch';


@Injectable()
export class MemberNJSService
{
  extractdata: string;
  private http;
  jwt: string;
  decodedJwt: string;
  response: string;
  constructor(private h: Http,public authHttp: AuthHttp)
  {
    this.http = h;
    this.jwt = localStorage.getItem('id_token');
    //this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
  }

  public getAllDocs(): Observable<Array<Member>>
  {
    let uri = confignjs.hostlocal + '/couchDataAll';
    return this.http.get(uri)
      .map((res: Response) => res.json());
  }
  public getDoc(id: string): Observable<Member>{
    let uri = confignjs.hostlocal + '/couchGet';
    return this.http.get(uri + '?id=' + id)
      .map((res: Response) => res.json());
  }
  private q2: Array<Member>;

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  public testSave2(): Observable<any>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions( { headers: headers } );
    let uri = confignjs.hostlocal + '/couchSave';
    let obj = {"testField:": "testVariable"};
    let data = JSON.stringify(obj);

    return this.http.post(uri, data, options).map(x => console.log(x.json()))
      .catch( this.handleError);
  }
  public testSave(){
    this.testSave2().subscribe(m => console.log(JSON.stringify(m)));
  }
  public putDoc(member: Member) {

    let uri = confignjs.hostlocal + '/couchSave';
    let geturi = confignjs.hostlocal + '/couchGet';
    let result =  this.save(uri,JSON.stringify(member)).subscribe(m => {member._rev = m.rev;});
    //member._rev = result.rev;
    /*this.getDoc(member._id).subscribe(j => {
     member = j;
     });*/


  };
  private save(uri: string,data: string) : Observable<any>{
    // this won't actually work because the StarWars API doesn't
    // is read-only. But it would look like this:
    let ret = new Member('',false);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions( { headers: headers } );
    return this.http.post(uri, data, options).map(x => x.json());

  }


}
