import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { MyAttendanceComponent } from './components/my-attendance/my-attendance.component';
import { AuthGuard, AdminGuard, EmployeeGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employees', 
    component: EmployeeListComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'employees/add', 
    component: EmployeeFormComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'employees/edit/:id', 
    component: EmployeeFormComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'attendance', 
    component: AttendanceComponent, 
    canActivate: [AuthGuard, EmployeeGuard] 
  },
  { 
    path: 'my-attendance', 
    component: MyAttendanceComponent, 
    canActivate: [AuthGuard, EmployeeGuard] 
  },
  { path: '**', redirectTo: '/login' }
];