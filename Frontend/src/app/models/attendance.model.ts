export interface CheckInRequest {
  notes?: string;
}

export interface AttendanceResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  checkInTime: Date;
  checkOutTime?: Date;
  workingHours?: string;
  notes?: string;
  date: string;
}

export interface AttendanceReport {
  employeeId: number;
  employeeName: string;
  totalDaysWorked: number;
  totalWorkingHours: string;
  averageWorkingHours: string;
  attendances: AttendanceResponse[];
}

export interface CheckInStatus {
  hasCheckedInToday: boolean;
  isValidCheckInTime: boolean;
  currentTime: string;
  allowedCheckInTime: string;
}