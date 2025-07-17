import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Employee System</h2>
          <p class="text-muted mb-0">Manage employee records and information</p>
        </div>
        <button class="btn btn-primary" (click)="navigateToAdd()" *ngIf="isAdmin">
          <i class="fas fa-plus me-2"></i>Add Employee
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search employees by name, email, department..." 
                  [(ngModel)]="searchTerm"
                  (keyup.enter)="searchEmployees()"
                  (input)="onSearchInput()">
                <button class="btn btn-outline-secondary" type="button" (click)="searchEmployees()">
                  <i class="fas fa-search"></i>
                </button>
                <button class="btn btn-outline-secondary" type="button" (click)="clearSearch()">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="sortBy" (change)="loadEmployees()">
                <option value="">Sort by...</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="department">Department</option>
                <option value="position">Position</option>
                <option value="salary">Salary</option>
                <option value="hireDate">Hire Date</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="pageSize" (change)="loadEmployees()">
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Table -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="fas fa-users me-2"></i>Employees 
            <span class="badge bg-primary ms-2">{{ totalCount }}</span>
          </h5>
          <div class="form-check form-switch" *ngIf="isAdmin">
            <input class="form-check-input" type="checkbox" [(ngModel)]="sortDescending" (change)="loadEmployees()" id="sortOrder">
            <label class="form-check-label" for="sortOrder">
              Descending
            </label>
          </div>
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
                  <th (click)="sort('firstName')" class="sortable">
                    Name <i class="fas fa-sort"></i>
                  </th>
                  <th (click)="sort('email')" class="sortable">
                    Email <i class="fas fa-sort"></i>
                  </th>
                  <th>Phone</th>
                  <th>National ID</th>
                  <th>Age</th>
                  <th (click)="sort('department')" class="sortable">
                    Department <i class="fas fa-sort"></i>
                  </th>
                  <th (click)="sort('position')" class="sortable">
                    Position <i class="fas fa-sort"></i>
                  </th>
                  <th (click)="sort('salary')" class="sortable" *ngIf="isAdmin">
                    Salary <i class="fas fa-sort"></i>
                  </th>
                  <th (click)="sort('hireDate')" class="sortable">
                    Hire Date <i class="fas fa-sort"></i>
                  </th>
                  <th>Signature</th>
                  <th *ngIf="isAdmin">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let employee of employees">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar-circle me-2">
                        {{ employee.firstName.charAt(0) }}{{ employee.lastName.charAt(0) }}
                      </div>
                      <div>
                        <strong>{{ employee.firstName }} {{ employee.lastName }}</strong>
                      </div>
                    </div>
                  </td>
                  <td>{{ employee.email }}</td>
                  <td>{{ employee.phoneNumber }}</td>
                  <td>{{ employee.nationalId }}</td>
                  <td>{{ employee.age }}</td>
                  <td>
                    <span class="badge bg-secondary">{{ employee.department }}</span>
                  </td>
                  <td>{{ employee.position }}</td>
                  <td *ngIf="isAdmin">{{ employee.salary | currency }}</td>
                  <td>{{ employee.hireDate | date:'shortDate' }}</td>
                  <td>
                    <span *ngIf="employee.signatureBase64" class="badge bg-success">
                      <i class="fas fa-check"></i> Yes
                    </span>
                    <span *ngIf="!employee.signatureBase64" class="badge bg-warning">
                      <i class="fas fa-times"></i> No
                    </span>
                  </td>
                  <td *ngIf="isAdmin">
                    <div class="btn-group" role="group">
                      <button class="btn btn-sm btn-outline-primary" (click)="viewEmployee(employee.id)" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-warning" (click)="editEmployee(employee.id)" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" (click)="deleteEmployee(employee.id)" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div *ngIf="employees.length === 0" class="text-center py-4">
              <i class="fas fa-users fa-3x text-muted mb-3"></i>
              <p class="text-muted">No employees found.</p>
              <button class="btn btn-primary" (click)="navigateToAdd()" *ngIf="isAdmin">
                <i class="fas fa-plus me-2"></i>Add First Employee
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <nav *ngIf="totalPages > 1" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <button class="page-link" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              
              <li class="page-item" *ngFor="let page of getPageNumbers()" [class.active]="page === currentPage">
                <button class="page-link" (click)="goToPage(page)">{{ page }}</button>
              </li>
              
              <li class="page-item" [class.disabled]="currentPage === totalPages">
                <button class="page-link" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>

          <!-- Pagination Info -->
          <div class="d-flex justify-content-between align-items-center mt-3" *ngIf="totalCount > 0">
            <small class="text-muted">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalCount) }} of {{ totalCount }} employees
            </small>
            <small class="text-muted">
              Page {{ currentPage }} of {{ totalPages }}
            </small>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show mt-3">
        <i class="fas fa-check-circle me-2"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" (click)="successMessage = ''"></button>
      </div>

      <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show mt-3">
        <i class="fas fa-exclamation-circle me-2"></i>
        {{ errorMessage }}
        <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
      </div>
    </div>
  `,
  styles: [`
    .sortable {
      cursor: pointer;
      user-select: none;
    }
    .sortable:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(45deg, #007bff, #0056b3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.8rem;
    }
    .card {
      border-radius: 10px;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    .btn-group .btn {
      margin-right: 2px;
    }
    .fa-3x {
      font-size: 3rem;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;
  sortBy: string = '';
  sortDescending: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  Math = Math; // Make Math available in template

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees(
      this.searchTerm || undefined,
      this.currentPage,
      this.pageSize,
      this.sortBy || undefined,
      this.sortDescending
    ).subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
        this.loadEmployeesCount();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error loading employees. Please try again.';
        console.error('Error loading employees:', error);
      }
    });
  }

  loadEmployeesCount(): void {
    this.employeeService.getEmployeesCount(this.searchTerm || undefined).subscribe({
      next: (count) => {
        this.totalCount = count;
        this.totalPages = Math.ceil(count / this.pageSize);
      },
      error: (error) => {
        console.error('Error loading employee count:', error);
      }
    });
  }

  searchEmployees(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  onSearchInput(): void {
    // Auto-search after user stops typing for 500ms
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchEmployees();
    }, 500);
  }

  private searchTimeout: any;

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadEmployees();
  }

  sort(column: string): void {
    if (this.sortBy === column) {
      this.sortDescending = !this.sortDescending;
    } else {
      this.sortBy = column;
      this.sortDescending = false;
    }
    this.currentPage = 1;
    this.loadEmployees();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadEmployees();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  navigateToAdd(): void {
    this.router.navigate(['/employees/add']);
  }

  viewEmployee(id: number): void {
    this.router.navigate(['/employees/view', id]);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.successMessage = 'Employee deleted successfully!';
          this.loadEmployees();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error deleting employee. Please try again.';
          console.error('Error deleting employee:', error);
        }
      });
    }
  }
}