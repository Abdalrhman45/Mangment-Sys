export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  age: number;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  signatureBase64?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  age: number;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  signatureBase64?: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}