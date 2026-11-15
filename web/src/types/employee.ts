import { EMPLOYEE_POSITIONS } from "@/constants/employee";

export type EmployeePosition = (typeof EMPLOYEE_POSITIONS)[number];

export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  position: EmployeePosition;
  phone: string;
};

export type EmployeeInput = Omit<Employee, "id">;
