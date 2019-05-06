import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fundstransfer',
  templateUrl: './fundstransfer.component.html',
  styleUrls: ['./fundstransfer.component.css']
})
export class FundstransferComponent implements OnInit {
  name: String;
  amount: Number;

  constructor(private dataService: DataService,
              private flashMessage:FlashMessagesService,
              private router: Router) { }

  ngOnInit() {
  }
  onfundsSubmit(){
    const user = {
      username: this.name,
      amount: this.amount
    }
    this.dataService.fundstransfer(user).subscribe(data => {
      if(data.success){
        this.flashMessage.show('Transaction successful', {
          cssClass: 'alert-success',
          timeout: 5000});
        this.router.navigate(['dashboard']);
      } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000});
        this.router.navigate(['fundstransfer']);
      }
    });
  }

}
