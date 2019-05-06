import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { FundstransferComponent } from './components/fundstransfer/fundstransfer.component';

import {ValidationService} from './services/validation.service';
import {AuthService} from './services/auth.service';
import {DataService} from './services/data.service';
import { FlashMessagesModule } from 'angular2-flash-messages/module';
import { AuthGuard, AdminAuthGuard } from './guards/auth.guard';
import { AdminPortalComponent } from './components/admin-portal/admin-portal.component';
import { HistoryComponent } from './components/history/history.component';

const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path:'deposit', component: DepositComponent, canActivate:[AuthGuard]},
  {path:'withdraw', component: WithdrawComponent, canActivate:[AuthGuard]},
  {path:'admin', component: AdminPortalComponent, canActivate:[AdminAuthGuard]},
  {path:'fundstransfer', component: FundstransferComponent, canActivate:[AuthGuard]},
  {path:'history', component: HistoryComponent, canActivate:[AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    DepositComponent,
    WithdrawComponent,
    AdminPortalComponent,
    FundstransferComponent,
    HistoryComponent,
  ],
  imports: [
    BrowserModule ,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot()
  ],
  providers: [ValidationService, AuthService, AuthGuard, DataService, AdminAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
