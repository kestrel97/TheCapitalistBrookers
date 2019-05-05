import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service'
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  amount : number;
  constructor(private dataService: DataService,
              private router: Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  onDepositSubmit(){

    this.dataService.updateBalance(this.amount).subscribe(data => {
      if(data.success){
        this.flashMessage.show('Account balance has been updated', {
          cssClass: 'alert-success',
          timeout: 5000});
        this.router.navigate(['profile']);
      } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000});
        this.router.navigate(['deposit']);
      }
    });
}

}
