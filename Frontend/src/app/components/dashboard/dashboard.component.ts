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
    <div class="dashboard-container">
      <div class="container-fluid">
        <!-- Welcome Header -->
        <div class="welcome-card animate-fadeInUp">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="mb-2">Welcome back, {{ currentUser?.username }}! 👋</h1>
              <p class="mb-0 opacity-75">{{ currentUser?.role }} Dashboard - {{ currentTime | date:'fullDate' }}</p>
            </div>
            <div class="col-md-4 text-end">
              <div class="time-display">
                <i class="fas fa-clock me-2"></i>
                {{ currentTime | date:'HH:mm:ss' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Dashboard -->
        <div *ngIf="isAdmin" class="row animate-fadeInLeft">
          <!-- Total Employees Card -->
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stats-card">
              <div class="stats-icon bg-primary-gradient">
                <i class="fas fa-users"></i>
              </div>
              <div class="stats-number">{{ totalEmployees }}</div>
              <div class="stats-label">Total Employees</div>
            </div>
          </div>

          <!-- Present Today Card -->
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stats-card">
              <div class="stats-icon bg-success-gradient">
                <i class="fas fa-user-check"></i>
              </div>
              <div class="stats-number">{{ todayAttendance }}</div>
              <div class="stats-label">Present Today</div>
            </div>
          </div>

          <!-- Average Hours Card -->
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stats-card">
              <div class="stats-icon bg-warning-gradient">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stats-number">{{ weeklyAverage }}h</div>
              <div class="stats-label">Avg. Weekly Hours</div>
            </div>
          </div>

          <!-- Active Employees Card -->
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stats-card">
              <div class="stats-icon bg-info-gradient">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="stats-number">{{ activeEmployees }}</div>
              <div class="stats-label">Active Employees</div>
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
    .dashboard-container {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      padding: 2rem 0;
    }
    
    .stats-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .stats-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .stats-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    
    .stats-number {
      font-size: 3rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }
    
    .stats-label {
      color: #6c757d;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.875rem;
    }
    
    .stats-icon {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      opacity: 0.8;
    }
    
    .bg-primary-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .bg-success-gradient {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .bg-warning-gradient {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .bg-info-gradient {
      background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    }
    
    .welcome-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    
    .quick-actions-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .action-btn {
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 1rem;
      text-decoration: none;
      color: #495057;
      transition: all 0.3s ease;
      display: block;
      margin-bottom: 0.75rem;
    }
    
    .action-btn:hover {
      border-color: #667eea;
      color: #667eea;
      transform: translateX(5px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    }
    
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 0.5rem;
    }
    
    .status-success {
      background: #28a745;
      box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
    }
    
    .status-warning {
      background: #ffc107;
      box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
    }
    
    .time-display {
      font-family: 'Courier New', monospace;
      font-size: 1.25rem;
      font-weight: 600;
      color: #667eea;
    }
    
    .animate-pulse {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
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