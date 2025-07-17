import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';
import { CheckInStatus, AttendanceResponse, CheckInRequest } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0">
                <i class="fas fa-clock me-2"></i>Attendance Management
              </h3>
            </div>
            <div class="card-body">
              <!-- Current Status -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="card border-info">
                    <div class="card-body text-center">
                      <h5>Current Time</h5>
                      <h3 class="text-primary">{{ currentTime | date:'HH:mm:ss' }}</h3>
                      <p class="text-muted mb-0">{{ currentTime | date:'fullDate' }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card" [class.border-success]="checkInStatus?.hasCheckedInToday" [class.border-warning]="!checkInStatus?.hasCheckedInToday">
                    <div class="card-body text-center">
                      <h5>Today's Status</h5>
                      <div *ngIf="checkInStatus?.hasCheckedInToday" class="text-success">
                        <i class="fas fa-check-circle fa-2x mb-2"></i>
                        <h4>Checked In</h4>
                      </div>
                      <div *ngIf="!checkInStatus?.hasCheckedInToday" class="text-warning">
                        <i class="fas fa-exclamation-circle fa-2x mb-2"></i>
                        <h4>Not Checked In</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Check-in Form -->
              <div *ngIf="!checkInStatus?.hasCheckedInToday" class="mb-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">Check In</h5>
                  </div>
                  <div class="card-body">
                    <div *ngIf="!checkInStatus?.isValidCheckInTime" class="alert alert-warning">
                      <i class="fas fa-exclamation-triangle me-2"></i>
                      Check-in is only allowed between {{ checkInStatus?.allowedCheckInTime }}
                    </div>

                    <form [formGroup]="checkInForm" (ngSubmit)="checkIn()">
                      <div class="mb-3">
                        <label for="notes" class="form-label">Notes (Optional)</label>
                        <textarea 
                          class="form-control" 
                          id="notes" 
                          formControlName="notes"
                          rows="3"
                          placeholder="Add any notes about your work day..."></textarea>
                      </div>

                      <div class="d-grid">
                        <button 
                          type="submit" 
                          class="btn btn-success btn-lg"
                          [disabled]="!checkInStatus?.isValidCheckInTime || isLoading">
                          <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                          <i class="fas fa-sign-in-alt me-2"></i>
                          {{ isLoading ? 'Checking In...' : 'Check In' }}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <!-- Check-out Button -->
              <div *ngIf="checkInStatus?.hasCheckedInToday && !hasCheckedOut" class="mb-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">Check Out</h5>
                  </div>
                  <div class="card-body text-center">
                    <p>Ready to end your work day?</p>
                    <button 
                      class="btn btn-warning btn-lg"
                      [disabled]="isLoading"
                      (click)="checkOut()">
                      <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <i class="fas fa-sign-out-alt me-2"></i>
                      {{ isLoading ? 'Checking Out...' : 'Check Out' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Success/Error Messages -->
              <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show">
                <i class="fas fa-check-circle me-2"></i>
                {{ successMessage }}
                <button type="button" class="btn-close" (click)="successMessage = ''"></button>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show">
                <i class="fas fa-exclamation-circle me-2"></i>
                {{ errorMessage }}
                <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
              </div>

              <!-- Today's Attendance -->
              <div *ngIf="todayAttendance" class="card">
                <div class="card-header">
                  <h5 class="mb-0">Today's Record</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <strong>Check In:</strong><br>
                      {{ todayAttendance.checkInTime | date:'HH:mm:ss' }}
                    </div>
                    <div class="col-md-4" *ngIf="todayAttendance.checkOutTime">
                      <strong>Check Out:</strong><br>
                      {{ todayAttendance.checkOutTime | date:'HH:mm:ss' }}
                    </div>
                    <div class="col-md-4" *ngIf="todayAttendance.workingHours">
                      <strong>Working Hours:</strong><br>
                      {{ formatWorkingHours(todayAttendance.workingHours) }}
                    </div>
                  </div>
                  <div *ngIf="todayAttendance.notes" class="mt-3">
                    <strong>Notes:</strong><br>
                    {{ todayAttendance.notes }}
                  </div>
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
    .fa-2x {
      font-size: 2rem;
    }
    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1.1rem;
    }
  `]
})
export class AttendanceComponent implements OnInit {
  checkInForm: FormGroup;
  checkInStatus: CheckInStatus | null = null;
  todayAttendance: AttendanceResponse | null = null;
  currentTime = new Date();
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  hasCheckedOut = false;

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService
  ) {
    this.checkInForm = this.fb.group({
      notes: ['']
    });

    // Update time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnInit(): void {
    this.loadCheckInStatus();
    this.loadTodayAttendance();
  }

  loadCheckInStatus(): void {
    this.attendanceService.getCheckInStatus().subscribe({
      next: (status) => {
        this.checkInStatus = status;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load check-in status';
        console.error('Error loading check-in status:', error);
      }
    });
  }

  loadTodayAttendance(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.attendanceService.getMyAttendance(today, tomorrow).subscribe({
      next: (attendances) => {
        if (attendances.length > 0) {
          this.todayAttendance = attendances[0];
          this.hasCheckedOut = !!this.todayAttendance.checkOutTime;
        }
      },
      error: (error) => {
        console.error('Error loading today attendance:', error);
      }
    });
  }

  checkIn(): void {
    if (this.checkInForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const checkInRequest: CheckInRequest = this.checkInForm.value;

      this.attendanceService.checkIn(checkInRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Successfully checked in!';
          this.todayAttendance = response;
          this.loadCheckInStatus();
          this.checkInForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to check in. Please try again.';
        }
      });
    }
  }

  checkOut(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.attendanceService.checkOut().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Successfully checked out!';
        this.todayAttendance = response;
        this.hasCheckedOut = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to check out. Please try again.';
      }
    });
  }

  formatWorkingHours(workingHours: string): string {
    if (!workingHours) return '0h 0m';
    
    // Parse time span format (e.g., "08:30:00")
    const parts = workingHours.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      return `${hours}h ${minutes}m`;
    }
    
    return workingHours;
  }
}