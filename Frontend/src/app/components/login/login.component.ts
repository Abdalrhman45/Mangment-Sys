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
    <div class="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden">
      <!-- Background Animation -->
      <div class="login-background"></div>
      <div class="login-overlay"></div>
      
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="card shadow-heavy animate-fadeInUp">
              <div class="card-body p-5">
                <!-- Logo/Brand Section -->
                <div class="text-center mb-5">
                  <div class="mb-4">
                    <div class="avatar avatar-lg mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                      <i class="fas fa-building"></i>
                    </div>
                  </div>
                  <h2 class="display-title mb-2">Employee System</h2>
                  <p class="text-muted">Welcome back! Please sign in to your account</p>
                </div>

                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="needs-validation" novalidate>
                  <!-- Email Field -->
                  <div class="form-floating mb-4">
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      formControlName="email"
                      [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                      placeholder="name@company.com">
                    <label for="email">
                      <i class="fas fa-envelope me-2"></i>Email Address
                    </label>
                    <div class="invalid-feedback">
                      <i class="fas fa-exclamation-circle me-1"></i>
                      Please enter a valid email address.
                    </div>
                  </div>

                  <!-- Password Field -->
                  <div class="form-floating mb-4">
                    <input 
                      type="password" 
                      class="form-control" 
                      id="password" 
                      formControlName="password"
                      [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                      placeholder="Password">
                    <label for="password">
                      <i class="fas fa-lock me-2"></i>Password
                    </label>
                    <div class="invalid-feedback">
                      <i class="fas fa-exclamation-circle me-1"></i>
                      Password must be at least 6 characters long.
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="d-grid mb-4">
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg" 
                      [disabled]="loginForm.invalid || isLoading">
                      <span *ngIf="isLoading" class="loading-spinner me-2"></span>
                      <i *ngIf="!isLoading" class="fas fa-sign-in-alt me-2"></i>
                      {{ isLoading ? 'Signing in...' : 'Sign In' }}
                    </button>
                  </div>

                  <!-- Error Message -->
                  <div *ngIf="errorMessage" class="alert alert-danger animate-fadeInUp" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    {{ errorMessage }}
                  </div>
                </form>

                <!-- Demo Credentials -->
                <div class="text-center">
                  <div class="card bg-light border-0 p-3">
                    <h6 class="text-muted mb-3">
                      <i class="fas fa-info-circle me-2"></i>Demo Accounts
                    </h6>
                    <div class="row text-start">
                      <div class="col-12 mb-2">
                        <div class="d-flex align-items-center">
                          <div class="avatar avatar-sm me-2 bg-gradient-primary">
                            <i class="fas fa-user-tie"></i>
                          </div>
                          <div>
                            <small class="fw-bold text-primary">Admin Account</small><br>
                            <small class="text-muted">admin&#64;company.com / password123</small>
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="d-flex align-items-center">
                          <div class="avatar avatar-sm me-2 bg-gradient-success">
                            <i class="fas fa-user"></i>
                          </div>
                          <div>
                            <small class="fw-bold text-success">Employee Account</small><br>
                            <small class="text-muted">john.doe&#64;company.com / password123</small>
                          </div>
                        </div>
                      </div>
                    </div>
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
    .min-vh-100 {
      min-height: 100vh;
    }
    
    .card {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }
    
    .form-floating > .form-control:focus ~ label,
    .form-floating > .form-control:not(:placeholder-shown) ~ label {
      opacity: 0.65;
      transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      font-weight: 600;
      padding: 0.75rem 2rem;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .bg-gradient-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .bg-gradient-success {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: -2;
    }
    
    .login-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
      z-index: -1;
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
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