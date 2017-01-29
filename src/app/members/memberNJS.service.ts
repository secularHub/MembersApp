/**
 * Created by fox21 on 12/30/2016.
 */
import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Member } from './member';
import { confignjs} from './config';
//import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/catch';


@Injectable()
export class MemberNJSService
{
  private http: Http;
  jwt: string;
  decodedJwt: string;

  private options: RequestOptions;

  constructor(private h: Http)
  {
    this.http = h;
    this.jwt = localStorage.getItem('id_token');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions( { headers: headers } );
    this.createAuthorizationHeader(headers);
    /*this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);*/
    //this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
  }
  private createAuthorizationHeader(headers: Headers)
  {

    headers.append('Authorization','JWT' + this.jwt);
  }
  public getAllDocs(): Observable<Array<Member>>
  {
    let uri = confignjs.hostlocal + '/couchDataAll?jwt=' + this.jwt;
    return this.http.get(uri)
      .map((res: Response) => res.json());
  }

  public getDoc(id: string): Observable<Member> {
    let uri = confignjs.hostlocal + '/couchGet';
    return this.http.get(uri + '?id=' + id + '&jwt=' + this.jwt)
      .map((res: Response) => res.json());
  }

  public getProtected(id: string): Observable<string>{
    let uri = confignjs.hostlocal + '/api/protected/random-quote';
    return this.http.get(uri + '?jwt=' + localStorage.getItem('id_token'))
      .map((res: Response) => res.json());
  }
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

  public putDoc(member: Member) {
    this.save(JSON.stringify(member)).subscribe(m => {
      member._rev = m.rev;}
      );
  };
  public saveMember(data: Member) : Observable<any>{
    let uri = confignjs.hostlocal + '/couchSave';
    return this.http.post(uri, JSON.stringify(data), this.options).map(x => x.json());
  }
  private save(data: string) : Observable<any>{
    // this won't actually work because the StarWars API doesn't
    // is read-only. But it would look like this:

    let uri = confignjs.hostlocal + '/couchSave';
    return this.http.post(uri, data, this.options).map(x => x.json());

  }
  public addMonths (date, count):Date {
    if(date == null)
      return new Date();
    let nd: Date;
    if (date && count) {
      nd = new Date(date);

      if(count === 12) {
        nd.setFullYear(nd.getFullYear() + 1);
      }
      else {
        if(nd.getMonth() === 11)
        {
          nd.setMonth(0,1);
          nd.setFullYear(nd.getFullYear() + 1);
        }
        nd.setMonth(nd.getMonth() + count, 1);
      }

    }
    return nd;
  }


}
