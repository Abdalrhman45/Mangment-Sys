import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttendanceService } from '../../services/attendance.service';
import { EmployeeService } from '../../services/employee.service';
import { User } from '../../models/auth.model';
import { Employee } from '../../models/employee.model';
import { CheckInStatus, AttendanceReport } from '../../models/attendance.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Welcome, {{ currentUser?.username }}!</h2>
              <p class="text-muted mb-0">{{ currentUser?.role }} Dashboard</p>
            </div>
            <div class="text-end">
              <small class="text-muted">{{ currentTime | date:'medium' }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Dashboard -->
      <div *ngIf="isAdmin" class="row">
        <div class="col-md-3 mb-4">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ totalEmployees }}</h4>
                  <p class="mb-0">Total Employees</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ todayAttendance }}</h4>
                  <p class="mb-0">Present Today</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-check-circle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ weeklyAverage }}h</h4>
                  <p class="mb-0">Avg. Weekly Hours</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-clock fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ activeEmployees }}</h4>
                  <p class="mb-0">Active Employees</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-user-check fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="row">
            <div class="col-md-6 mb-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Quick Actions</h5>
                </div>
                <div class="card-body">
                  <div class="d-grid gap-2">
                    <button class="btn btn-outline-primary" routerLink="/employees">
                      <i class="fas fa-users me-2"></i>Manage Employees
                    </button>
                    <button class="btn btn-outline-success" routerLink="/attendance-reports">
                      <i class="fas fa-chart-bar me-2"></i>Attendance Reports
                    </button>
                    <button class="btn btn-outline-info" routerLink="/employees/add">
                      <i class="fas fa-user-plus me-2"></i>Add New Employee
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Dashboard -->
      <div *ngIf="isEmployee" class="row">
        <div class="col-md-4 mb-4">
          <div class="card" [class.border-success]="checkInStatus?.hasCheckedInToday" [class.border-warning]="!checkInStatus?.hasCheckedInToday">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-clock me-2"></i>Attendance Today
              </h5>
            </div>
            <div class="card-body text-center">
              <div *ngIf="checkInStatus?.hasCheckedInToday" class="text-success">
                <i class="fas fa-check-circle fa-3x mb-3"></i>
                <h4>Checked In</h4>
                <p class="text-muted">You're all set for today!</p>
              </div>
              <div *ngIf="!checkInStatus?.hasCheckedInToday" class="text-warning">
                <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
                <h4>Not Checked In</h4>
                <p class="text-muted">Don't forget to check in!</p>
                <button 
                  class="btn btn-success" 
                  [disabled]="!checkInStatus?.isValidCheckInTime"
                  routerLink="/attendance">
                  Check In Now
                </button>
                <small class="d-block mt-2 text-muted">
                  Check-in time: {{ checkInStatus?.allowedCheckInTime }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-user me-2"></i>My Profile
              </h5>
            </div>
            <div class="card-body" *ngIf="employeeProfile">
              <p><strong>Name:</strong> {{ employeeProfile.firstName }} {{ employeeProfile.lastName }}</p>
              <p><strong>Department:</strong> {{ employeeProfile.department }}</p>
              <p><strong>Position:</strong> {{ employeeProfile.position }}</p>
              <p><strong>Employee ID:</strong> {{ employeeProfile.nationalId }}</p>
              <button class="btn btn-outline-primary btn-sm" routerLink="/profile">
                View Full Profile
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-chart-line me-2"></i>This Week
              </h5>
            </div>
            <div class="card-body" *ngIf="weeklyReport">
              <p><strong>Days Worked:</strong> {{ weeklyReport.totalDaysWorked }}</p>
              <p><strong>Total Hours:</strong> {{ formatTimeSpan(weeklyReport.totalWorkingHours) }}</p>
              <p><strong>Average Hours:</strong> {{ formatTimeSpan(weeklyReport.averageWorkingHours) }}</p>
              <button class="btn btn-outline-info btn-sm" routerLink="/my-attendance">
                View Full History
              </button>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-2">
                  <button class="btn btn-outline-success w-100" routerLink="/attendance">
                    <i class="fas fa-sign-in-alt me-2"></i>Check In/Out
                  </button>
                </div>
                <div class="col-md-3 mb-2">
                  <button class="btn btn-outline-primary w-100" routerLink="/my-attendance">
                    <i class="fas fa-history me-2"></i>My Attendance
                  </button>
                </div>
                <div class="col-md-3 mb-2">
                  <button class="btn btn-outline-info w-100" routerLink="/profile">
                    <i class="fas fa-user-edit me-2"></i>Update Profile
                  </button>
                </div>
                <div class="col-md-3 mb-2">
                  <button class="btn btn-outline-secondary w-100" routerLink="/signature">
                    <i class="fas fa-signature me-2"></i>Update Signature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
    .btn {
      border-radius: 6px;
    }
    .fa-3x {
      font-size: 3rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  currentTime = new Date();
  
  // Admin stats
  totalEmployees = 0;
  activeEmployees = 0;
  todayAttendance = 0;
  weeklyAverage = 0;
  
  // Employee data
  checkInStatus: CheckInStatus | null = null;
  employeeProfile: Employee | null = null;
  weeklyReport: AttendanceReport | null = null;

  constructor(
    private authService: AuthService,
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService
  ) {
    // Update time every minute
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.isAdmin) {
      this.loadAdminStats();
    } else if (this.isEmployee) {
      this.loadEmployeeData();
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }

  private loadAdminStats(): void {
    // Load employee count
    this.employeeService.getEmployeesCount().subscribe({
      next: (count) => {
        this.totalEmployees = count;
        this.activeEmployees = count; // Assuming all are active for now
      },
      error: (error) => console.error('Error loading employee stats:', error)
    });

    // Load attendance reports for stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    this.attendanceService.getAllAttendanceReports(weekAgo).subscribe({
      next: (reports) => {
        this.todayAttendance = reports.filter(r => r.totalDaysWorked > 0).length;
        if (reports.length > 0) {
          const totalHours = reports.reduce((sum, r) => sum + this.parseTimeSpan(r.averageWorkingHours), 0);
          this.weeklyAverage = Math.round(totalHours / reports.length);
        }
      },
      error: (error) => console.error('Error loading attendance stats:', error)
    });
  }

  private loadEmployeeData(): void {
    // Load check-in status
    this.attendanceService.getCheckInStatus().subscribe({
      next: (status) => this.checkInStatus = status,
      error: (error) => console.error('Error loading check-in status:', error)
    });

    // Load employee profile
    this.employeeService.getMyProfile().subscribe({
      next: (profile) => this.employeeProfile = profile,
      error: (error) => console.error('Error loading profile:', error)
    });

    // Load weekly report
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    this.attendanceService.getMyAttendanceReport(weekAgo).subscribe({
      next: (report) => this.weeklyReport = report,
      error: (error) => console.error('Error loading weekly report:', error)
    });
  }

  formatTimeSpan(timeSpan: string): string {
    if (!timeSpan) return '0h 0m';
    
    const hours = this.parseTimeSpan(timeSpan);
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    
    return `${h}h ${m}m`;
  }

  private parseTimeSpan(timeSpan: string): number {
    if (!timeSpan) return 0;
    
    // Parse format like "08:30:00" or "PT8H30M"
    if (timeSpan.includes(':')) {
      const parts = timeSpan.split(':');
      return parseInt(parts[0]) + parseInt(parts[1]) / 60;
    }
    
    return 0;
  }
}