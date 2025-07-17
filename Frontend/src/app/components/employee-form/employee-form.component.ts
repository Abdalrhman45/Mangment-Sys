import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { CreateEmployeeDto } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3>{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="firstName" 
                      formControlName="firstName"
                      [class.is-invalid]="employeeForm.get('firstName')?.invalid && employeeForm.get('firstName')?.touched">
                    <div class="invalid-feedback">
                      First name is required and must be less than 100 characters.
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="lastName" 
                      formControlName="lastName"
                      [class.is-invalid]="employeeForm.get('lastName')?.invalid && employeeForm.get('lastName')?.touched">
                    <div class="invalid-feedback">
                      Last name is required and must be less than 100 characters.
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Email *</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      formControlName="email"
                      [class.is-invalid]="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched">
                    <div class="invalid-feedback">
                      Please enter a valid email address.
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="phoneNumber" class="form-label">Phone Number *</label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phoneNumber" 
                      formControlName="phoneNumber"
                      [class.is-invalid]="employeeForm.get('phoneNumber')?.invalid && employeeForm.get('phoneNumber')?.touched">
                    <div class="invalid-feedback">
                      Phone number is required.
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="nationalId" class="form-label">National ID *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="nationalId" 
                      formControlName="nationalId"
                      [class.is-invalid]="employeeForm.get('nationalId')?.invalid && employeeForm.get('nationalId')?.touched">
                    <div class="invalid-feedback">
                      National ID is required and must be less than 20 characters.
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="age" class="form-label">Age *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="age" 
                      formControlName="age"
                      min="18"
                      max="100"
                      [class.is-invalid]="employeeForm.get('age')?.invalid && employeeForm.get('age')?.touched">
                    <div class="invalid-feedback">
                      Age is required and must be between 18 and 100.
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="department" class="form-label">Department *</label>
                    <select 
                      class="form-select" 
                      id="department" 
                      formControlName="department"
                      [class.is-invalid]="employeeForm.get('department')?.invalid && employeeForm.get('department')?.touched">
                      <option value="">Select Department</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                    </select>
                    <div class="invalid-feedback">
                      Please select a department.
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="position" class="form-label">Position *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="position" 
                      formControlName="position"
                      [class.is-invalid]="employeeForm.get('position')?.invalid && employeeForm.get('position')?.touched">
                    <div class="invalid-feedback">
                      Position is required and must be less than 100 characters.
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="salary" class="form-label">Salary *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="salary" 
                      formControlName="salary"
                      min="0"
                      step="0.01"
                      [class.is-invalid]="employeeForm.get('salary')?.invalid && employeeForm.get('salary')?.touched">
                    <div class="invalid-feedback">
                      Please enter a valid salary amount.
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="hireDate" class="form-label">Hire Date *</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="hireDate" 
                      formControlName="hireDate"
                      [class.is-invalid]="employeeForm.get('hireDate')?.invalid && employeeForm.get('hireDate')?.touched">
                    <div class="invalid-feedback">
                      Please select a hire date.
                    </div>
                  </div>
                </div>

                <!-- Signature Section -->
                <div class="mb-3">
                  <label class="form-label">Employee Signature</label>
                  <div class="card">
                    <div class="card-body">
                      <div *ngIf="!signatureBase64" class="text-center py-4">
                        <i class="fas fa-signature fa-3x text-muted mb-3"></i>
                        <p class="text-muted">No signature uploaded</p>
                        <input 
                          type="file" 
                          class="form-control" 
                          accept="image/*"
                          (change)="onSignatureFileSelected($event)">
                        <small class="text-muted">Upload signature image (PNG, JPG, GIF)</small>
                      </div>
                      <div *ngIf="signatureBase64" class="text-center">
                        <img [src]="'data:image/png;base64,' + signatureBase64" 
                             alt="Employee Signature" 
                             class="img-fluid mb-3"
                             style="max-height: 100px; border: 1px solid #ddd; padding: 10px;">
                        <div>
                          <button type="button" class="btn btn-sm btn-outline-danger" (click)="removeSignature()">
                            <i class="fas fa-trash me-1"></i>Remove Signature
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" (click)="goBack()">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary" [disabled]="employeeForm.invalid">
                    {{ isEditMode ? 'Update Employee' : 'Add Employee' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId?: number;
  signatureBase64?: string;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      nationalId: ['', [Validators.required, Validators.maxLength(20)]],
      age: [18, [Validators.required, Validators.min(18), Validators.max(100)]],
      department: ['', [Validators.required, Validators.maxLength(100)]],
      position: ['', [Validators.required, Validators.maxLength(100)]],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = +params['id'];
        this.loadEmployee();
      }
    });
  }

  loadEmployee(): void {
    if (this.employeeId) {
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (employee) => {
          this.employeeForm.patchValue({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phoneNumber: employee.phoneNumber,
            nationalId: employee.nationalId,
            age: employee.age,
            department: employee.department,
            position: employee.position,
            salary: employee.salary,
            hireDate: new Date(employee.hireDate).toISOString().split('T')[0]
          });
          this.signatureBase64 = employee.signatureBase64;
        },
        error: (error) => {
          console.error('Error loading employee:', error);
          alert('Error loading employee data.');
          this.goBack();
        }
      });
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData: CreateEmployeeDto = {
        ...this.employeeForm.value,
        hireDate: new Date(this.employeeForm.value.hireDate),
        signatureBase64: this.signatureBase64
      };

      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe({
          next: () => {
            alert('Employee updated successfully!');
            this.goBack();
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            alert('Error updating employee. Please try again.');
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            alert('Employee added successfully!');
            this.goBack();
          },
          error: (error) => {
            console.error('Error creating employee:', error);
            alert('Error creating employee. Please try again.');
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  onSignatureFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Convert to base64 and remove data URL prefix
        const base64 = e.target.result.split(',')[1];
        this.signatureBase64 = base64;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSignature(): void {
    this.signatureBase64 = undefined;
  }
}