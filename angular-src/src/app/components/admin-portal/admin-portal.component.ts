import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {

  users: any

  constructor(private dataService: DataService,
    private flashMessage:FlashMessagesService) { }

  ngOnInit() {
    this.dataService.getUnverifiedUsers().subscribe(users => {
      console.log(users);
      this.users = users;
    })
  }

  verifyUser(index) {
    event.preventDefault();
    this.dataService.verifyUser(this.users[index]._id).subscribe(data => {
      if(data.success) {
        this.flashMessage.show('User verified.', {
          cssClass: 'alert-success',
          timeout: 5000});
        this.users[index].is_verified = true;
      } else {
        this.flashMessage.show('User could not be verified', {
          cssClass: 'alert-danger',
          timeout: 5000});
      }
    }, err => this.flashMessage.show('User could not be verified', {
      cssClass: 'alert-danger',
      timeout: 5000}))
  }


}
