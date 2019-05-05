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
      let username= name['username'];
      // console.log(username);
      this.data = {
        amount: amount,
        name: username
      }
      headers.append("Content-Type", "application/json");
      // console.log("kuch bhi")
      return this.http.post('http://localhost:3000/users/updateBalance', this.data, {headers: headers})
        .pipe(map(res => res.json()))
    }

}
