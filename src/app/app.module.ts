import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { MembersComponent } from './members/members.component';
import { FilterPipe } from './members/filter.pipe';
import { PaymentComponent } from './payment/payment.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { routing } from "./app.routing";
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { NametagsComponent } from './nametags/nametags.component';
import { ReportsComponent } from './reports/reports.component';
//import {AuthHttp} from "angular2-jwt";


@NgModule({
  declarations: [
    AppComponent,
    MembersComponent,
    FilterPipe,
    PaymentComponent,
    MaintenanceComponent,
    NavbarComponent,
    LoginComponent,
    NametagsComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
