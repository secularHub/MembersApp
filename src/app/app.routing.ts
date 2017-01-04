import { RouterModule, Routes } from '@angular/router';
import {MembersComponent} from "./members/members.component";
import {MaintenanceComponent} from "./maintenance/maintenance.component";


//todo create some auth routes
export const AppRoutes: Routes = [
  { path: 'members', component: MembersComponent },
  {path: 'maintenance', component: MaintenanceComponent}
];

export const routing = RouterModule.forRoot(
  AppRoutes
);

/**
 * Created by fox21 on 1/4/2017.
 */
