import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
 import {Cookie} from 'ng2-cookies/ng2-cookies'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private url = 'https://chatapi.edwisor.com/api/v1';
  constructor(public http:HttpClient) {}

  public signupFunction(data):Observable<any> {
    const params = new HttpParams()
   .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('mobileNumber',data.mobileNumber)
    .set('email',data.email)
    .set('password',data.password)
    .set('apiKey',data.apiKey);
    return this.http.post(this.url+'/users/signup',data);
  }

  public signinFunction(data):Observable<any> {
    const params = new HttpParams()
    .set('email',data.email)
    .set('password',data.password);
         return this.http.post(this.url+'/users/login',data);
  }
  public setUserInfoInLocalStorage = (data) =>{
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  public getUserInfoFromLocalStorage =() =>{
    return JSON.parse(localStorage.getItem('userInfo'));
  }
  public logout(): Observable<any> {
    const params = new HttpParams()
    .set('authToken',Cookie.get('authToken'))
    return this.http.post(`${this.url}/users/logout`, params);
  }
}