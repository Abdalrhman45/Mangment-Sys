import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="card shadow">
              <div class="card-body p-4">
                <div class="text-center mb-4">
                  <h2 class="card-title">Employee System</h2>
                  <p class="text-muted">Sign in to your account</p>
                </div>

                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      formControlName="email"
                      [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                      placeholder="Enter your email">
                    <div class="invalid-feedback">
                      Please enter a valid email address.
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="password" 
                      formControlName="password"
                      [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                      placeholder="Enter your password">
                    <div class="invalid-feedback">
                      Password must be at least 6 characters long.
                    </div>
                  </div>

                  <div class="d-grid mb-3">
                    <button 
                      type="submit" 
                      class="btn btn-primary" 
                      [disabled]="loginForm.invalid || isLoading">
                      <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ isLoading ? 'Signing in...' : 'Sign In' }}
                    </button>
                  </div>

                  <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                  </div>
                </form>

                <div class="text-center">
                  <small class="text-muted">
                    Demo Accounts:<br>
                    <strong>Admin:</strong> admin&#64;company.com / password123<br>
                    <strong>Employee:</strong> john.doe&#64;company.com / password123
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      min-height: 100vh;
    }
    .card {
      border: none;
      border-radius: 10px;
    }
    .btn-primary {
      background: linear-gradient(45deg, #007bff, #0056b3);
      border: none;
    }
    .btn-primary:hover {
      background: linear-gradient(45deg, #0056b3, #004085);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}