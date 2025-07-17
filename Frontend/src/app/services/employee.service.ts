import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, CreateEmployeeDto } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) { }

  getEmployees(
    searchTerm?: string, 
    page: number = 1, 
    pageSize: number = 10, 
    sortBy?: string, 
    sortDescending: boolean = false
  ): Observable<Employee[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortDescending) {
      params = params.set('sortDescending', 'true');
    }
    
    return this.http.get<Employee[]>(this.apiUrl, { params });
  }

  getEmployeesCount(searchTerm?: string): Observable<number> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<number>(`${this.apiUrl}/count`, { params });
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  getMyProfile(): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/my-profile`);
  }

  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: CreateEmployeeDto): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  updateEmployeeSignature(id: number, signatureBase64: string): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/update-signature/${id}`, JSON.stringify(signatureBase64), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}