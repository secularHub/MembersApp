import { RouterModule, Routes } from '@angular/router';
import { MembersComponent } from "./members/members.component";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { LoginComponent } from "./login/login.component";
import { NametagsComponent } from './nametags/nametags.component';
import { ReportsComponent } from './reports/reports.component';
import { LocationStrategy } from "@angular/common";
import { AppComponent } from "./app.component";

// TODO: create some auth routes
export const AppRoutes: Routes = [
  { path: 'members', component: MembersComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'nametags', component: NametagsComponent },
  { path: 'reports', component: ReportsComponent}
];

export const routing = RouterModule.forRoot(
  AppRoutes
);
