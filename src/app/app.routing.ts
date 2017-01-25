import { RouterModule, Routes } from '@angular/router';
import {MembersComponent} from "./members/members.component";
import {MaintenanceComponent} from "./maintenance/maintenance.component";
import {LoginComponent} from "./login/login.component";
import { NametagsComponent } from './nametags/nametags.component';

//todo create some auth routes
export const AppRoutes: Routes = [
  { path: '#login', component: LoginComponent },
  { path: '#members', component: MembersComponent },
  /*{ path: 'members', component: MembersComponent },*/
  { path: '#maintenance', component: MaintenanceComponent },
  { path: '#nametags', component: NametagsComponent }
];

export const routing = RouterModule.forRoot(
  AppRoutes
);

/**
 * Created by fox21 on 1/4/2017.
 */
