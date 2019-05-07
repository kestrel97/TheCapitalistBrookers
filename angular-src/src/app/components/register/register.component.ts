import { Component, OnInit } from '@angular/core';
import {ValidationService} from '../../services/validation.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;
  usecase: String;

  constructor(private validationService: ValidationService,
              private flashMessage:FlashMessagesService,
              private authService:AuthService,
              private router: Router
             ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
      usecase: this.usecase
    }

    // Required Fields
    if(!this.validationService.validateRegister(user)){
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Validate Email
    if(!this.validationService.validateEmail(user.email)){
      this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    // Register user
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        this.flashMessage.show('You are now registered, you can login after manual verification of your account.', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      }
      else{
        if (data.msg) {
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        } else {
          this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
        }
        this.router.navigate(['/register']);
      }
    });

  }

}
