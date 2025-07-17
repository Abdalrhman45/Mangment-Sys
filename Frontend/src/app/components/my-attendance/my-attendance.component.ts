import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceResponse, AttendanceReport } from '../../models/attendance.model';

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>My Attendance History</h2>
              <p class="text-muted mb-0">View your attendance records and working hours</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Date Range Filter -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <label for="fromDate" class="form-label">From Date</label>
              <input 
                type="date" 
                class="form-control" 
                id="fromDate" 
                [(ngModel)]="fromDate"
                (change)="loadAttendance()">
            </div>
            <div class="col-md-4">
              <label for="toDate" class="form-label">To Date</label>
              <input 
                type="date" 
                class="form-control" 
                id="toDate" 
                [(ngModel)]="toDate"
                (change)="loadAttendance()">
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button class="btn btn-outline-secondary me-2" (click)="setThisWeek()">This Week</button>
              <button class="btn btn-outline-secondary me-2" (click)="setThisMonth()">This Month</button>
              <button class="btn btn-outline-secondary" (click)="clearDates()">All Time</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row mb-4" *ngIf="attendanceReport">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <h3>{{ attendanceReport.totalDaysWorked }}</h3>
              <p class="mb-0">Days Worked</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body text-center">
              <h3>{{ formatTimeSpan(attendanceReport.totalWorkingHours) }}</h3>
              <p class="mb-0">Total Hours</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body text-center">
              <h3>{{ formatTimeSpan(attendanceReport.averageWorkingHours) }}</h3>
              <p class="mb-0">Average Hours</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body text-center">
              <h3>{{ getAttendanceRate() }}%</h3>
              <p class="mb-0">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Attendance Records -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-history me-2"></i>Attendance Records
          </h5>
        </div>
        <div class="card-body">
          <div *ngIf="isLoading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div class="table-responsive" *ngIf="!isLoading">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of attendanceRecords">
                  <td>
                    <strong>{{ record.date | date:'fullDate' }}</strong><br>
                    <small class="text-muted">{{ record.date | date:'EEEE' }}</small>
                  </td>
                  <td>
                    <span class="badge bg-success">
                      <i class="fas fa-sign-in-alt me-1"></i>
                      {{ record.checkInTime | date:'HH:mm:ss' }}
                    </span>
                  </td>
                  <td>
                    <span *ngIf="record.checkOutTime" class="badge bg-warning">
                      <i class="fas fa-sign-out-alt me-1"></i>
                      {{ record.checkOutTime | date:'HH:mm:ss' }}
                    </span>
                    <span *ngIf="!record.checkOutTime" class="badge bg-secondary">
                      <i class="fas fa-clock me-1"></i>
                      Still Working
                    </span>
                  </td>
                  <td>
                    <span *ngIf="record.workingHours" class="badge bg-info">
                      {{ formatWorkingHours(record.workingHours) }}
                    </span>
                    <span *ngIf="!record.workingHours" class="text-muted">-</span>
                  </td>
                  <td>
                    <span *ngIf="record.checkOutTime" class="badge bg-success">
                      <i class="fas fa-check-circle me-1"></i>Complete
                    </span>
                    <span *ngIf="!record.checkOutTime" class="badge bg-warning">
                      <i class="fas fa-clock me-1"></i>In Progress
                    </span>
                  </td>
                  <td>
                    <span *ngIf="record.notes" class="text-muted">{{ record.notes }}</span>
                    <span *ngIf="!record.notes" class="text-muted">-</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div *ngIf="attendanceRecords.length === 0" class="text-center py-4">
              <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
              <p class="text-muted">No attendance records found for the selected period.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="alert alert-danger mt-3">
        <i class="fas fa-exclamation-circle me-2"></i>
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    .badge {
      font-size: 0.8rem;
    }
    .fa-3x {
      font-size: 3rem;
    }
  `]
})
export class MyAttendanceComponent implements OnInit {
  attendanceRecords: AttendanceResponse[] = [];
  attendanceReport: AttendanceReport | null = null;
  fromDate: string = '';
  toDate: string = '';
  isLoading = false;
  errorMessage = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.setThisMonth();
    this.loadAttendance();
  }

  loadAttendance(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const fromDateObj = this.fromDate ? new Date(this.fromDate) : undefined;
    const toDateObj = this.toDate ? new Date(this.toDate) : undefined;

    // Load attendance records
    this.attendanceService.getMyAttendance(fromDateObj, toDateObj).subscribe({
      next: (records) => {
        this.attendanceRecords = records;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load attendance records';
        console.error('Error loading attendance:', error);
      }
    });

    // Load attendance report
    this.attendanceService.getMyAttendanceReport(fromDateObj, toDateObj).subscribe({
      next: (report) => {
        this.attendanceReport = report;
      },
      error: (error) => {
        console.error('Error loading attendance report:', error);
      }
    });
  }

  setThisWeek(): void {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    this.fromDate = firstDayOfWeek.toISOString().split('T')[0];
    this.toDate = lastDayOfWeek.toISOString().split('T')[0];
    this.loadAttendance();
  }

  setThisMonth(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.fromDate = firstDayOfMonth.toISOString().split('T')[0];
    this.toDate = lastDayOfMonth.toISOString().split('T')[0];
    this.loadAttendance();
  }

  clearDates(): void {
    this.fromDate = '';
    this.toDate = '';
    this.loadAttendance();
  }

  formatTimeSpan(timeSpan: string): string {
    if (!timeSpan) return '0h 0m';
    
    // Parse time span format (e.g., "08:30:00")
    const parts = timeSpan.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      return `${hours}h ${minutes}m`;
    }
    
    return timeSpan;
  }

  formatWorkingHours(workingHours: string): string {
    return this.formatTimeSpan(workingHours);
  }

  getAttendanceRate(): number {
    if (!this.attendanceReport || !this.fromDate || !this.toDate) return 0;
    
    const fromDate = new Date(this.fromDate);
    const toDate = new Date(this.toDate);
    const totalDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1;
    const workingDays = Math.floor(totalDays * 5 / 7); // Assuming 5-day work week
    
    if (workingDays === 0) return 0;
    
    return Math.round((this.attendanceReport.totalDaysWorked / workingDays) * 100);
  }
}