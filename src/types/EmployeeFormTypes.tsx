export interface EmployeeFormData {
  employeeCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  hireDate: string;
  email: string;
  phoneNumber: string;
  departmentId: number;
  positionId: number;
  salary: number;
  status: string;
  profilePicture?: File | null;
  presignedRequestUrl?: string | null;
  profilePictureUrl?: string | null;
}

export interface DepartmentOption {
  departmentId: number;
  name: string;
}

export interface PositionOption {
  positionId: number;
  title: string;
}
