import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service'
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  amount: number;
  constructor(private dataService: DataService,
              private router: Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }
  onWithdrawSubmit(){
    this.dataService.updateBalance(-1*(this.amount)).subscribe(data => {
      if(data.success){
        this.flashMessage.show('Account balance has been updated', {
          cssClass: 'alert-success',
          timeout: 5000});
        this.router.navigate(['profile']);
      } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000});
        this.router.navigate(['withdraw']);
      }
    });
  }

}
