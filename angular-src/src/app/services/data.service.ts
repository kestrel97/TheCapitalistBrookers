import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class DataService {
  someAmount: any
  data: any
  constructor(private http: Http) { }

  updateBalance(amount){

      this.someAmount=amount;
      let headers = new Headers();
      let name= JSON.parse(localStorage.getItem('user'));
      let token = localStorage.getItem('id_token');
      let username= name['username'];
      // console.log(username);
      this.data = {
        amount: amount,
        name: username
      }
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", token);
      // console.log("kuch bhi")
      return this.http.post('http://localhost:3000/users/updateBalance', this.data, {headers: headers})
        .pipe(map(res => res.json()))
    }

  getUnverifiedUsers() {
    let headers = new Headers();
    let token = localStorage.getItem('id_token');
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", token);
    return this.http.get('http://localhost:3000/users/getAll', {headers: headers})
        .pipe(map(res => res.json()));
  }

  verifyUser(_id) {
    let headers = new Headers();
    let token = localStorage.getItem('id_token');
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", token);

    const data = {
      "id" : _id
    };

    return this.http.post('http://localhost:3000/users/verifyUser', data, {headers: headers})
        .pipe(map(res => res.json()));
  }
}
