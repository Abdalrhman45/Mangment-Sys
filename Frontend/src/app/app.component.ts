import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/auth.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div *ngIf="currentUser" class="app-layout">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" routerLink="/dashboard">
            <i class="fas fa-building me-2"></i>Employee System
          </a>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                  <i class="fas fa-tachometer-alt me-1"></i>Dashboard
                </a>
              </li>
              
              <!-- Admin Navigation -->
              <li class="nav-item" *ngIf="isAdmin">
                <a class="nav-link" routerLink="/employees" routerLinkActive="active">
                  <i class="fas fa-users me-1"></i>Employees
                </a>
              </li>
              
              <!-- Employee Navigation -->
              <li class="nav-item" *ngIf="isEmployee">
                <a class="nav-link" routerLink="/attendance" routerLinkActive="active">
                  <i class="fas fa-clock me-1"></i>Attendance
                </a>
              </li>
              <li class="nav-item" *ngIf="isEmployee">
                <a class="nav-link" routerLink="/my-attendance" routerLinkActive="active">
                  <i class="fas fa-history me-1"></i>My Records
                </a>
              </li>
            </ul>
            
            <ul class="navbar-nav">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                  <i class="fas fa-user-circle me-1"></i>{{ currentUser.username }}
                  <span class="badge bg-{{ isAdmin ? 'danger' : 'success' }} ms-2">{{ currentUser.role }}</span>
                </a>
                <ul class="dropdown-menu">
                  <li><h6 class="dropdown-header">{{ currentUser.email }}</h6></li>
                  <li><hr class="dropdown-divider"></li>
                  <li *ngIf="isEmployee">
                    <a class="dropdown-item" routerLink="/profile">
                      <i class="fas fa-user me-2"></i>My Profile
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" (click)="logout()">
                      <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
    
    <div *ngIf="!currentUser" class="login-layout">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .main-content {
      flex: 1;
      background-color: #f8f9fa;
      padding-bottom: 2rem;
    }
    
    .login-layout {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .navbar-brand {
      font-weight: bold;
    }
    
    .nav-link {
      transition: all 0.3s ease;
    }
    
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
    }
    
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 5px;
    }
    
    .badge {
      font-size: 0.7rem;
    }
    
    .dropdown-menu {
      border-radius: 10px;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Employee System';
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && this.router.url === '/login') {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }

  logout(): void {
    this.authService.logout();
  }
}