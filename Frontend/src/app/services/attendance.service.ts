import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AttendanceResponse, AttendanceReport, CheckInRequest, CheckInStatus } from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) { }

  checkIn(checkInRequest: CheckInRequest): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.apiUrl}/checkin`, checkInRequest);
  }

  checkOut(): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.apiUrl}/checkout`, {});
  }

  getMyAttendance(fromDate?: Date, toDate?: Date): Observable<AttendanceResponse[]> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.set('fromDate', fromDate.toISOString());
    }
    if (toDate) {
      params = params.set('toDate', toDate.toISOString());
    }
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/my-attendance`, { params });
  }

  getMyAttendanceReport(fromDate?: Date, toDate?: Date): Observable<AttendanceReport> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.set('fromDate', fromDate.toISOString());
    }
    if (toDate) {
      params = params.set('toDate', toDate.toISOString());
    }
    return this.http.get<AttendanceReport>(`${this.apiUrl}/my-report`, { params });
  }

  getEmployeeAttendance(employeeId: number, fromDate?: Date, toDate?: Date): Observable<AttendanceResponse[]> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.set('fromDate', fromDate.toISOString());
    }
    if (toDate) {
      params = params.set('toDate', toDate.toISOString());
    }
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/employee/${employeeId}`, { params });
  }

  getAllAttendanceReports(fromDate?: Date, toDate?: Date): Observable<AttendanceReport[]> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.set('fromDate', fromDate.toISOString());
    }
    if (toDate) {
      params = params.set('toDate', toDate.toISOString());
    }
    return this.http.get<AttendanceReport[]>(`${this.apiUrl}/reports`, { params });
  }

  getCheckInStatus(): Observable<CheckInStatus> {
    return this.http.get<CheckInStatus>(`${this.apiUrl}/check-status`);
  }
}