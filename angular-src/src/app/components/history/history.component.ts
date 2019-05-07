import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  trxHistory: any;
  user_id: any;

  constructor(private dataService:DataService, private authService: AuthService) { }

  ngOnInit() {
    this.user_id = this.authService.getUserId();

    this.dataService.getHistory().subscribe(trxHistory => {
      console.log(trxHistory);
      this.trxHistory = trxHistory;
    },
    err => {
      console.log(err);
      return false;
    });
  }

}
